const mongoose = require('mongoose');
const path = require('path');

const User = require(path.resolve(__dirname, 'userModel'));

const PostSchema = new mongoose.Schema({
  authorId: { type: String, required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  date: { type: Date, default: Date.now },
  likes: { type: Number, default: 0 },
  comments: { type: Number, default: 0 },
  score: { type: Number, default: 0 }
});

PostSchema.index(
  { title: 'text', content: 'text' },
  { default_language: 'pt', weights: { title: 2, content: 1 } }
);

const PostModel = mongoose.model('Post', PostSchema);

class Post {
  constructor(body) {
    this.body = body;
    this.errors = [];
    this.post = null;
  }

  async create() {
    const post = await PostModel.create(this.body);
    this.post = await Post.getUserData(post);
  }

  static async readAll() {
    const posts = await PostModel.find().sort({ date: -1 });
    return await Post.getUserData(posts);
  }

  static async readById(id) {
    if (typeof id !== 'string') return;
    const post = await PostModel.findById(id);
    return await Post.getUserData(post);
  }

  static async readByUser(id) {
    if (typeof id !== 'string') return;
    const posts = await PostModel.find({ 'authorId': id }).sort({ date: -1 });
    return await Post.getUserData(posts);
  }

  static async readByUserAndText(userName, text) {
    if (typeof userName !== 'string') return;
    if (typeof text !== 'string') return;
    const posts = await PostModel.find({ 'username': userName, content: { $regex: text, $options: 'i' } }).sort({ date: -1 });
    return await Post.getUserData(posts);
  }

  static async update(id, body) {
    if (typeof id !== 'string') return;

    const post = await PostModel.findById(id);

    const edit = {
      title: body.title || post.title,
      content: body.content || post.content
    };
    const update = await PostModel.findByIdAndUpdate(id, edit, { new: true });
    return await Post.getUserData(update);
  }

  static async delete(id) {
    if (typeof id !== 'string') return;
    const post = await PostModel.findByIdAndDelete(id);
    return await Post.getUserData(post);
  }

  static async like(id, add) {
    if (typeof id !== 'string') return;

    const post = await PostModel.findById(id);

    const value = add ? 1 : -1;

    const edit = {
      likes: post.likes + value,
    };
    if (edit.likes < 0 || edit.score < 0) return post;
    const update = await PostModel.findByIdAndUpdate(id, edit, { new: true });
    return await Post.getUserData(update);
  }

  static async comment(id, add) {
    if (typeof id !== 'string') return;

    const post = await PostModel.findById(id);

    const value = add ? 1 : -1;
    const newScore = add ? 10 : -10;

    const edit = {
      comments: post.comments + value,
      score: post.score + newScore,
    };
    if (edit.comments < 0 || edit.score < 0) return post;
    const update = await PostModel.findByIdAndUpdate(id, edit, { new: true });
    return await Post.getUserData(update);
  }

  static async score(id, score) {
    if (typeof id !== 'string') return;

    let post = await PostModel.findById(id);

    const edit = {
      score: post.score + score
    };
    if (edit.score < 0) return post;
    const update = await PostModel.findByIdAndUpdate(id, edit, { new: true });
    return await Post.getUserData(update);
  }

  static async filter(text) {
    const posts = await PostModel.find({ $text: { $search: text } }).sort({ date: -1 });
    return await Post.getUserData(posts);
  }

  static async readFilter(text) {
    const posts = await PostModel.find({ $text: { $search: text } }).sort({ date: -1 });
    return await Post.getUserData(posts);
  }

  static async getUserData(data) {
    if (Array.isArray(data)) {
      const arr = [];
      for (const post of data) {
        const user = await User.readById(post.authorId);
        post.user = {
          name: user.username,
          profileURL: user.profileURL,
        };
        arr.push(post);
      }
      return arr;
    }

    const user = await User.readById(data.authorId);
    data.user = {
      name: user.username,
      profileURL: user.profileURL,
    };
    return data;
  }
}

module.exports = Post;
