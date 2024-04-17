const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({

});

const CommentSchema = new mongoose.Schema({
  user: {
    name: { type: String, required: true },
    profileURL: { type: String, required: true },
    id: { type: String, required: true }
  },
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
    return await CommentModel.find().sort({ date: -1 });
  }

  static async readByUser(userName) {
    if (typeof userName !== 'string') return;
    return await CommentModel.find({ 'user.name': userName }).sort({ date: -1 });
  }

  static async update(id, body) {
    if (typeof id !== 'string') return;

    const comment = await CommentModel.findById(id);

    const edit = {
      content: body.content || comment.content
    };
    return await CommentModel.findByIdAndUpdate(id, edit, { new: true });
  }

  static async delete(id) {
    if (typeof id !== 'string') return;
    return await CommentModel.findByIdAndDelete(id);
  }

  static async like(id, add = true) {
    if (typeof id !== 'string') return;

    const comment = await CommentModel.findById(id);

    const value = add ? 1 : -1;

    const edit = {
      likes: comment.likes + value,
    };
    if (edit.likes < 0 || edit.score < 0) return comment;
    return await CommentModel.findByIdAndUpdate(id, edit, { new: true });
  }

  static async score(id, score) {
    if (typeof id !== 'string') return;

    let comment = await CommentModel.findById(id);

    const edit = {
      score: comment.score + score
    };
    if (edit.score < 0) return comment;
    return await CommentModel.findByIdAndUpdate(id, edit, { new: true });
  }

  static async findPostsComment(postID) {
    if (typeof postID !== 'string') return;
    return await CommentModel.find({ postId: postID }).sort({ date: -1 });
  }
}

module.exports = Comment;
