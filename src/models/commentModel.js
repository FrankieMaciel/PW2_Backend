const mongoose = require('mongoose');
const User = require('./userModel');
const Post = require('./postModel');

const CommentSchema = new mongoose.Schema({
  authorId: { type: String, required: true },
  postId: { type: String, required: true },
  content: { type: String, required: true },
  likes: { type: Number, default: 0 },
  score: { type: Number, default: 0 },
  date: { type: Date, default: Date.now },
});

CommentSchema.index(
  { content: 'text' },
  { default_language: 'pt', weights: { title: 2, content: 1 } }
);

const CommentModel = mongoose.model('Comment', CommentSchema);

class Comment {
  constructor(body) {
    this.body = body;
    this.errors = [];
    this.comment = null;
  }

  async create() {
    this.comment = await CommentModel.create(this.body);
  }

  static async readAll() {
    const comment = await CommentModel.find().sort({ date: -1 });
    return await this.formatCommentObject(comment);
  }

  static async readByUser(userName) {
    if (typeof userName !== 'string') return;
    const comment = await CommentModel.find({ 'user.name': userName }).sort({ date: -1 });
    return await this.formatCommentObject(comment);
  }

  static async update(id, body) {
    if (typeof id !== 'string') return;

    const comment = await CommentModel.findById(id);

    const edit = {
      content: body.content || comment.content
    };
    const update = await CommentModel.findByIdAndUpdate(id, edit, { new: true });
    return await this.formatCommentObject(update);
  }

  static async delete(id) {
    if (typeof id !== 'string') return;
    const comment = await CommentModel.findByIdAndDelete(id);
    return await this.formatCommentObject(comment);
  }

  static async like(id, add = true) {
    if (typeof id !== 'string') return;

    const comment = await CommentModel.findById(id);

    const value = add ? 1 : -1;

    const edit = {
      likes: comment.likes + value,
    };
    if (edit.likes < 0 || edit.score < 0) return comment;
    const update = await CommentModel.findByIdAndUpdate(id, edit, { new: true });
    return await this.formatCommentObject(update);
  }

  static async score(id, score) {
    if (typeof id !== 'string') return;

    let comment = await CommentModel.findById(id);

    const edit = {
      score: comment.score + score
    };
    if (edit.score < 0) return comment;
    const update = await CommentModel.findByIdAndUpdate(id, edit, { new: true });
    return await this.formatCommentObject(update);
  }

  static async findPostsComment(postID) {
    if (typeof postID !== 'string') return;
    const comment = await CommentModel.find({ postId: postID }).sort({ date: -1 });
    return await this.formatCommentObject(comment);
  }

  static async countComments(postID) {
    if (typeof postID !== 'string') return;
    const comment = await CommentModel.find({ postId: postID })
    return comment.length
  }

  static async formatCommentObject(data) {
    if (Array.isArray(data)) {
      const arr = [];
      for (const comment of data) {
        const user = await User.readById(comment.authorId);
        const { _id, ...commentData } = comment._doc;
        arr.push({
          id: _id,
          ...commentData,
          user: {
            id: user._id,
            name: user.username,
            profileURL: user.profileURL,
          }
        });
      }
      return arr;
    }

    const user = await User.readById(data.authorId);
    const { _id, ...commentData } = data._doc;
    return {
      id: _id,
      ...commentData,
      user: {
        id: user._id,
        name: user.name,
        profileURL: user.profileURL,
      }
    };
  }
}

module.exports = Comment;
