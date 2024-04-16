const path = require('path');

const Comment = require(path.resolve(__dirname, '..', 'models', 'commentModel'));

class CommentController {
  async create(req, res) {
    try {
      const comment = new Comment(req.body);
      
      await comment.create();
      return res.status(200).json({
        message: 'Comentário Criado com sucesso!',
        payload: comment
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
      const comments = await Comment.readAll();
      return res.status(200).json(comments);
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        errors: ['Ocorreu um erro no servidor!']
      });
    }
  };

  async readByUser(req, res) {
    try {
      const user = req.params.id;
      const comments = await Comment.readByUser(user);
      return res.status(200).json(comments);
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        errors: ['Ocorreu um erro no servidor!']
      });
    }
  };

  async update(req, res) {
    try {
      const comment = await Comment.update(req.params.id, req.body);
      return res.status(200).json({
        message: 'Comentário atualizado com sucesso!',
        payload: comment
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
      const comment = await Comment.delete(postID);
      return res.status(200).json({
        message: 'Comentário deletado com sucesso!',
        payload: comment
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
      const comments = await Comment.readFilter(textFilter);
      return res.json(comments);
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        errors: ['Ocorreu um erro no servidor!']
      });
    }
  };

  async findPostsComment(req, res) {
    try {
      const postId = req.params.id;
      const comments = await Comment.findPostsComment(postId);
      return res.status(200).json(comments);
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        errors: ['Ocorreu um erro no servidor!']
      });
    }
  };
}

module.exports = new CommentController();