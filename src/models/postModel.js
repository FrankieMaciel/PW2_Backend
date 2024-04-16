const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  profileURL: { type: String, required: true },
});

const PostSchema = new mongoose.Schema({
  user: { type: UserSchema, required: true },
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
    this.post = await PostModel.create(this.body)
  }

  static async readAll() {
    return await PostModel.find().sort({ date: -1 });
  }

  static async readById(id) {
    if (typeof userName !== 'string') return;
    return await PostModel.findById(id);
  }

  static async readByUser(userName) {
    if (typeof userName !== 'string') return;
    const posts = await PostModel.find({ 'user.name': userName }).sort({ date: -1 });
    return posts;
  }

  static async update(id, body) {
    if (typeof id !== 'string') return;

    const post = await PostModel.findById(id);

    const edit = {
      title: body.title || post.title,
      content: body.content || post.content
    };
    return await PostModel.findByIdAndUpdate(id, edit, { new: true });
  }

  static async delete(id) {
    if (typeof id !== 'string') return;
    return await PostModel.findByIdAndDelete(id);
  }

  static async like(id, add) {
    if (typeof id !== 'string') return;

    const post = await PostModel.findById(id);

    const value = add ? 1 : -1;
    const newScore = add ? 5 : -5;

    const edit = {
      likes: post.likes + value,
      score: post.score + newScore,
    };
    await PostModel.findByIdAndUpdate(id, edit, { new: true });
  }

  static async filter(text) {
    return await PostModel.find({ $text: { $search: text } }).sort({ date: -1 });
  }

  static async readFilter(text) {
    return await PostModel.find({ $text: { $search: text } }.sort({ date: -1 }));
  }
}

module.exports = Post;
