require('dotenv').config();

const secretKey = process.env.SECRET_KEY;

const path = require('path');
const fs = require('fs');
const jwt = require('jsonwebtoken');

const User = require(path.resolve(__dirname, '..', 'models', 'userModel'));
const ErrorType = require(path.resolve(__dirname, '..', 'config', 'ErrorType'));

class UserController {
  async create(req, res) {
    try {
      const user = new User(req.body);

      await user.register();
      if (user.errors.length > 0) {
        return res.status(400).json({
          message: 'Não foi possível registrar um usuário!',
          errors: user.errors,
        });
      }

      const token = jwt.sign({
        id: user._id, email: user.user.username
      }, secretKey);

      return res.status(200).json({
        message: 'Usuário criado com sucesso!',
        payload: {
          token: token,
          id: user.user._id,
          username: user.user.username,
          email: user.user.email,
          profileURL: user.user.profileURL,
          score: user.user.score
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

  async login(req, res) {
    try {
      console.log(req.body);
      const user = new User(req.body);
      await user.login();

      if (user.errors.length > 0)
        return res.status(400).json({
          message: 'Não foi possível fazer login!',
          errors: user.errors
        });

      const token = jwt.sign({
        id: user._id, nome: user.user.username
      }, secretKey);

      return res.status(200).json({
        message: 'Usuário logado com sucesso!',
        payload: {
          token: token,
          id: user.user._id,
          username: user.user.username,
          email: user.user.email,
          profileURL: user.user.profileURL,
          score: user.user.score
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
      const users = await User.readAll();
      const arr = users.map(user => {
        return {
          id: user._id,
          username: user.username,
          email: user.email,
          profileURL: user.profileURL,
          score: user.score
        };
      });
      return res.status(200).json(arr);
    } catch (err) {
      return res.status(500).json({
        errors: [{
          type: ErrorType.SERVER,
          message: 'Ocorreu um erro no servidor!'
        }]
      });
    }
  };

  async readById(req, res) {
    try {
      const user = await User.readById(req.params.id);
      return res.status(200).json({
        id: user._id,
        username: user.username,
        email: user.email,
        profileURL: user.profileURL,
        score: user.score
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        errors: ['Ocorreu um erro no servidor']
      });
    }
  };

  async update(req, res) {
    try {
      const user = await User.update(req.params.id, req.body);
      if (user.errors)
        return res.status(401).json({
          message: 'Não foi possível atualizar dados do usuário!',
          errors: user.errors
        });

      return res.status(200).json({
        message: 'Dados do usuário alterados com sucesso!',
        payload: {
          id: user._id,
          username: user.username,
          email: user.email,
          profileURL: user.profileURL,
          score: user.score
        }
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        errors: ['Ocorreu um erro no servidor']
      });
    }
  };

  async changeProfile(req, res) {
    console.log('Recebi uma imagem!');
    return res.status(200).json({
      message: ['Alguma coisa chegou!']
    });
  };

  async sendProfile(req, res) {

    const id = req.params.id;

    const imagePath = path.join('public', 'custom-pfp', `${id}.jpg`);
    const imageContent = fs.readFileSync(imagePath);
    console.log(imageContent);
    res.set('Content-Type', 'image/jpeg');

    return res.status(200).json(imageContent);
  };

  async delete(req, res) {
    try {
      const id = req.params.id;
      const user = await User.delete(id);
      res.status(200).json({
        message: 'Usuário deletado com sucesso!',
        payload: {
          id: user._id,
          username: user.username,
          email: user.email,
          profileURL: user.profileURL,
          score: user.score
        }
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({
        errors: [{
          type: ErrorType.SERVER,
          message: 'Ocorreu um erro no servidor!'
        }]
      });
    }
  };
}

module.exports = new UserController();