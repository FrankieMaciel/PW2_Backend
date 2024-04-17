const path = require('path');

const Post = require(path.resolve(__dirname, '..', 'models', 'postModel'));
const scoreController = require(path.resolve(__dirname, 'scoreController'));

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
        payload: post.post
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        errors: ['Ocorreu um erro no servidor!']
      });
    }
  };

  async readAll(req, res) {
    try {
      const posts = await Post.readAll();

      return res.status(200).json(posts);
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        errors: ['Ocorreu um erro no servidor!']
      });
    }
  };

  async readByUser(req, res) {
    try {
      const username = req.params.username;
      const posts = await Post.readByUser(username);

      return res.status(200).json(posts);
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        errors: ['Ocorreu um erro no servidor!']
      });
    }
  };

  async update(req, res) {
    try {
      const post = await Post.update(req.params.id, req.body);

      return res.status(200).json({
        message: 'Post atualizado com sucesso!',
        payload: post
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        errors: ['Ocorreu um erro no servidor!']
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
        payload: post
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        errors: ['Ocorreu um erro no servidor!']
      });
    }
  };

  async readFilter(req, res) {
    try {
      const textFilter = req.params.text;
      const posts = await Post.readFilter(textFilter);
      return res.json(posts);
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        errors: ['Ocorreu um erro no servidor!']
      });
    }
  };
}

module.exports = new PostController();