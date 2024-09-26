const mongoose = require('mongoose');

const LikeSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  postId: { type: String, required: true }
});

const LikeModel = mongoose.model('like', LikeSchema);

class Like {
  static async like(data) {
    return await LikeModel.create(data);
  }

  static async unlike(id) {
    return await LikeModel.findByIdAndDelete(id);
  }

  static async hasLiked(data) {
    const like = await LikeModel.findOne(data);
    return like?._id;
  }

  static async readByUser(userId) {
    const likes = await LikeModel.find({ userId });
    return likes.map(like => like.postId);
  }
}

module.exports = Like;