const path = require('path');

const User = require(path.resolve(__dirname, '..', 'models', 'userModel'));
const Post = require(path.resolve(__dirname, '..', 'models', 'postModel'));
const Comment = require(path.resolve(__dirname, '..', 'models', 'commentModel'));

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
      await User.score(userId, points.post * (add ? 1 : -1));
      await Post.score(postId, points.post * (add ? 1 : -1));
      await User.score(post.user.id, points.post * (add ? 1 : -1));
      return;
    } catch (err) {
      throw new Error(err);
    }
  }

  async likePost(req, res) {
    try {
      const id = req.params.id;
      const add = req.body.add;

      const post = await Post.like(id, add);
      const user = await User.score(post.user.id, points.like * (add ? 1 : -1));
      return res.status(200).json({
        message: `Postagem ${add ? '' : 'des'}curtida com sucesso!`,
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
      const add = req.body.add;

      const comment = await Comment.like(id, add);
      const post = await Post.readById(comment.postId);
      const user = await User.score(comment.user.id, points.like * (add ? 1 : -1));
      return res.status(200).json({
        message: `Comentário ${add ? '' : 'des'}curtido com sucesso!`,
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
}

module.exports = new ScoreController();