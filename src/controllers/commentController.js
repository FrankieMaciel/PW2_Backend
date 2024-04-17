const path = require('path');

const Comment = require(path.resolve(__dirname, '..', 'models', 'commentModel'));
const scoreController = require(path.resolve(__dirname, 'scoreController'));
const ErrorType = require('../config/ErrorType');

class CommentController {
  async create(req, res) {
    try {
      const comment = new Comment(req.body);
      await comment.create();
      await scoreController.comment(comment.comment.user.id, comment.comment.postId);
      return res.status(200).json({
        message: 'Comentário Criado com sucesso!',
        payload: {
          id: comment.comment.id,
          content: comment.comment.content,
          likes: comment.comment.likes,
          score: comment.comment.score,
          postId: comment.comment.postId,
          user: comment.comment.user,
        }
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        errors: [{
          type: ErrorType.SERVER,
          message: 'Ocorreu um erro no servidor!'
        }]
      });
    }
  };

  async readAll(req, res) {
    try {
      const comments = await Comment.readAll();
      const arr = comments.map(comment => {
        return {
          id: comment.id,
          content: comment.content,
          likes: comment.likes,
          score: comment.score,
          postId: comment.postId,
          user: comment.user,
        };
      });
      return res.status(200).json(arr);
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        errors: [{
          type: ErrorType.SERVER,
          message: 'Ocorreu um erro no servidor!'
        }]
      });
    }
  };

  async readByUser(req, res) {
    try {
      const user = req.params.username;
      const comments = await Comment.readByUser(user);
      const arr = comments.map(comment => {
        return {
          id: comment.id,
          content: comment.content,
          likes: comment.likes,
          score: comment.score,
          postId: comment.postId,
          user: comment.user,
        };
      });
      return res.status(200).json(arr);
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        errors: [{
          type: ErrorType.SERVER,
          message: 'Ocorreu um erro no servidor!'
        }]
      });
    }
  };

  async update(req, res) {
    try {
      const comment = await Comment.update(req.params.id, req.body);
      return res.status(200).json({
        message: 'Comentário atualizado com sucesso!',
        payload: {
          id: comment.id,
          content: comment.content,
          likes: comment.likes,
          score: comment.score,
          postId: comment.postId,
          user: comment.user,
        }
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        errors: [{
          type: ErrorType.SERVER,
          message: 'Ocorreu um erro no servidor!'
        }]
      });
    }
  };

  async delete(req, res) {
    try {
      const postID = req.params.id;
      const comment = await Comment.delete(postID);
      await scoreController.comment(comment.user.id, comment.postId, false);
      return res.status(200).json({
        message: 'Comentário deletado com sucesso!',
        payload: {
          id: comment.id,
          content: comment.content,
          likes: comment.likes,
          score: comment.score,
          postId: comment.postId,
          user: comment.user,
        }
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        errors: [{
          type: ErrorType.SERVER,
          message: 'Ocorreu um erro no servidor!'
        }]
      });
    }
  };

  async readFilter(req, res) {
    try {
      const textFilter = req.params.text;
      const comments = await Comment.readFilter(textFilter);
      const arr = comments.map(comment => {
        return {
          id: comment.id,
          content: comment.content,
          likes: comment.likes,
          score: comment.score,
          postId: comment.postId,
          user: comment.user,
        };
      });
      return res.status(200).json(arr);
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        errors: [{
          type: ErrorType.SERVER,
          message: 'Ocorreu um erro no servidor!'
        }]
      });
    }
  };

  async findPostsComment(req, res) {
    try {
      const postId = req.params.postId;
      const comments = await Comment.findPostsComment(postId);
      return res.status(200).json(comments);
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        errors: [{
          type: ErrorType.SERVER,
          message: 'Ocorreu um erro no servidor!'
        }]
      });
    }
  };
}

module.exports = new CommentController();