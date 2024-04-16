require('dotenv').config();

const secretKey = process.env.SECRET_KEY;

const path = require('path');
const fs = require('fs');
const jwt = require('jsonwebtoken');

const User = require(path.resolve(__dirname, '..', 'models', 'userModel'));

const create = async (req, res) => {
  try {
    const user = new User(req.body);

    await user.register();
    if (user.errors.length > 0) {
      console.log(
        'Não foi possível registrar um usuário!'
      );
      console.log(user.errors);
      return res.status(400).json({
        errors: user.errors,
      });
    }

    const token = jwt.sign({
      id: user._id, nome: user.user.username
    }, secretKey);

    let obj = {
      token: token,
      id: user.user._id,
      username: user.user.username,
      email: user.user.email,
      profileURL: user.user.profileURL,
      score: user.user.score
    };

    return res.status(200).json(obj);
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      errors: ['Ocorreu um erro no servidor.']
    });
  }
};

const login = async (req, res) => {
  try {
    console.log(req.body);
    const user = new User(req.body);
    await user.login();

    if (user.errors.length > 0) 
      return res.status(400).json({ errors: user.errors });

    const token = jwt.sign({
      id: user._id, nome: user.user.username
    }, secretKey);

    let obj = {
      token: token,
      id: user.user._id,
      username: user.user.username,
      email: user.user.email,
      profileURL: user.user.profileURL,
      score: user.user.score
    };
    console.log(obj);

    return res.status(200).json(obj);
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      errors: ['Ocorreu um erro no servidor.']
    });
  }
};

const readAll = async (req, res) => {
  try {
    let users = await User.readAll();
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({
      errors: ['Ocorreu um erro no servidor']
    })
  }
};

const readById = async (req, res) => {
  try {
    let user = await User.readById(req.params.id);
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({
      errors: ['Ocorreu um erro no servidor']
    })
  }
};

const update = async (req, res) => {
  try {
    const user = await User.update(req.params.id, req.body);

    if (user.errors.length > 0)
      return res.status(401).json({
        errors: user.errors
      })

    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({
      errors: ['Ocorreu um erro no servidor']
    })
  }
};

const changeProfile = async (req, res) => {
  console.log('Recebi uma imagem!');
  return res.status(200).json({
    message: ['Alguma coisa chegou!']
  });
};

const sendProfile = async (req, res) => {

  const id = req.params.id;

  const imagePath = path.join('public', 'custom-pfp', `${id}.jpg`);
  const imageContent = fs.readFileSync(imagePath);
  console.log(imageContent);
  res.set('Content-Type', 'image/jpeg');

  return res.status(200).json(imageContent);
};

const destroy = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.delete(id);
    res.status(200).json({
      message: 'Usuário deletado com sucesso!',
      payload: user
    });
  } catch (error) {
    res.status(500).json({
      message: 'Deu erro aqui no deletar post!',
      errors: [ error ]
    });
  }
};

module.exports = {
  create,
  login,
  readAll,
  readById,
  update,
  changeProfile,
  sendProfile,
  destroy,
};