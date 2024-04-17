const path = require('path');

const User = require(path.resolve(__dirname, '..', 'models', 'userModel'));
const Post = require(path.resolve(__dirname, '..', 'models', 'postModel'));
const Comment = require(path.resolve(__dirname, '..', 'models', 'commentModel'));

const points = {
  like: 5,
  comment: 10,
};

class ScoreController {
  async likePost(req, res) {
    try {
      const { id, add } = req.params;
      const post = await Post.like(id, add);
      const user = await User.score(post.user.id, points.like * (add ? 1 : -1));
      return res.status(200).json({
        message: `Post ${!add && 'des'}curtido com sucesso!`,
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
      const { id, add } = req.params;
      const comment = await Comment.like(id, add);
      const post = await Post.score(comment.postId)
      const user = await User.score(comment.user.id, points.like * (add ? 1 : -1));
      return res.status(200).json({
        message: `Comentário ${!add && 'des'}curtido com sucesso!`,
        payload: {
          user: {
            name: user.username,
            score: user.score
          },
          comment: {
            post: {
              title: post.likes
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

  async comment(comment, add) {
    try {
      await User.score(comment.user.id, points.comment * (add ? 1 : -1));
      const post = await Post.score(comment.postId, points.comment * (add ? 1 : -1));
      await User.score(post.user.id, points.comment * (add ? 1 : -1));

      return true;
    } catch (err) {
      throw new Error(err);
    }
  }
}

module.exports = new ScoreController();