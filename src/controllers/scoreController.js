const path = require('path');

const User = require(path.resolve(__dirname, '..', 'models', 'userModel'));
const Post = require(path.resolve(__dirname, '..', 'models', 'postModel'));
const Comment = require(path.resolve(__dirname, '..', 'models', 'commentModel'));
const Like = require('../models/likeModel');

const points = {
  like: 5,
  post: 10,
};

class ScoreController {
  async post(userId, add = true) {
    try {
      await User.score(userId, points.post * (add ? 1 : -1));
      return;
    } catch (err) {
      throw new Error(err);
    }
  }

  async comment(userId, postId, add = true) {
    try {
      const post = await Post.readById(postId);
      if (userId !== post.user.id) {
        await User.score(userId, points.post * (add ? 1 : -1));
        await Post.score(postId, points.post * (add ? 1 : -1));
        await User.score(post.user.id, points.post * (add ? 1 : -1));
      }
      return;
    } catch (err) {
      throw new Error(err);
    }
  }

  async likePost(req, res) {
    try {
      const id = req.params.id;
      const { userId } = req.body;

      const likeId = await Like.hasLiked({ postId: id, userId });
      if (likeId) await Like.unlike(likeId);
      else await Like.like({ postId: id, userId });

      const post = await Post.like(id, !likeId);
      const user = await User.readById(post.authorId || post.user.id.toString());
      if (userId !== user.id) {
        await Post.score(post.id.toString(), points.like * (likeId ? -1 : 1));
        await User.score(user.id.toString(), points.like * (likeId ? -1 : 1));
      }

      return res.status(200).json({
        message: `Postagem ${likeId ? '' : 'des'}curtida com sucesso!`,
        payload: {
          user: {
            name: user.username,
            score: user.score
          },
          post: {
            title: post.title,
            likes: post.likes,
            score: post.score
          }
        }
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        errors: ['Ocorreu um erro no servidor!']
      });
    }
  }

  async likeComment(req, res) {
    try {
      const id = req.params.id;
      const { userId } = req.body;

      const likeId = await Like.hasLiked({ postId: id, userId });
      if (likeId) await Like.unlike(likeId);
      else await Like.like({ postId: id, userId });

      const comment = await Comment.like(id, !likeId);
      const post = await Post.readById(comment.postId);
      const user = await User.readById(comment.authorId || comment.user.id.toString());
      if (userId !== user.id) {
        await Comment.score(comment.id.toString(), points.like * (likeId ? -1 : 1));
        await User.score(user.id.toString(), points.like * (likeId ? -1 : 1));
      }

      return res.status(200).json({
        message: `Comentário ${likeId ? '' : 'des'}curtido com sucesso!`,
        payload: {
          user: {
            name: user.username,
            score: user.score
          },
          comment: {
            post: {
              title: post.title
            },
            likes: comment.likes,
            score: comment.score
          }
        }
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        errors: ['Ocorreu um erro no servidor!']
      });
    }
  }

  async findLikes(req, res) {
    try {
      const userId = req.params.userId;
      const likes = await Like.readByUser(userId);
      return res.status(200).json(likes);
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        errors: ['Ocorreu um erro no servidor!']
      });
    }
  }
}

module.exports = new ScoreController();