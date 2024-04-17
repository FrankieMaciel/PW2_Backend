const jwt = require('jsonwebtoken');

const isAuthenticated = async (req, res, next) => {
  const authToken = req.header('Authorization');
  if (!authToken)
    return res.status(401).json({
      errors: ['Login necessário!']
    });

  const token = authToken.split(' ')[1];
  if (token) try {
    jwt.verify(token, process.env.SECRET_KEY);
    return next();
  } catch (e) {
    return res.status(401).json({
      errors: ['Usuário invalido! Tente fazer login novamente!']
    });
  }
  else return res.status(401).json({
    errors: ['Login necessário!']
  });
};

module.exports = {
  isAuthenticated
};