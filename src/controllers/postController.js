const path = require('path');

const Post = require(path.resolve(__dirname, '..', 'models', 'postModel'));
const scoreController = require(path.resolve(__dirname, 'scoreController'));
const ErrorType = require('../config/ErrorType');

class PostController {
  async create(req, res) {
    try {
      const post = new Post(req.body);
      await post.create();
      if (post.errors.length > 0)
        return res.status(400).json({
          message: 'Não foi possível criar postagem!',
          errors: post.errors,
        });
      await scoreController.post(post.post.user.id);

      return res.status(200).json({
        message: 'Post criado com sucesso!',
        payload: {
          id: post.post._id,
          title: post.post.title,
          content: post.post.content,
          likes: post.post.likes,
          comments: post.post.comments,
          score: post.post.score,
          user: post.post.user
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
      const posts = await Post.readAll();
      const arr = posts.map(post => {
        return {
          id: post._id,
          title: post.title,
          content: post.content,
          likes: post.likes,
          comments: post.comments,
          score: post.score,
          user: post.user
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
      const username = req.params.username;
      const posts = await Post.readByUser(username);
      const arr = posts.map(post => {
        return {
          id: post._id,
          title: post.title,
          content: post.content,
          likes: post.likes,
          comments: post.comments,
          score: post.score,
          user: post.user
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
      const post = await Post.update(req.params.id, req.body);

      return res.status(200).json({
        message: 'Post atualizado com sucesso!',
        payload: {
          id: post._id,
          title: post.title,
          content: post.content,
          likes: post.likes,
          comments: post.comments,
          score: post.score,
          user: post.user
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
      const post = await Post.delete(postID);
      await scoreController.post(post.user.id, false);
      return res.status(200).json({
        message: 'Post deletado com sucesso!',
        payload: {
          id: post._id,
          title: post.title,
          content: post.content,
          likes: post.likes,
          comments: post.comments,
          score: post.score,
          user: post.user
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
      const posts = await Post.readFilter(textFilter);
      const arr = posts.map(post => {
        return {
          id: post._id,
          title: post.title,
          content: post.content,
          likes: post.likes,
          comments: post.comments,
          score: post.score,
          user: post.user
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
}

module.exports = new PostController();