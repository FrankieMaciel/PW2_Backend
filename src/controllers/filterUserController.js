const path = require('path');

const User = require(path.resolve(__dirname, '..', 'models', 'userModel'));

class FilterUserController {
  async filterUsers(req, res) {
    const { username } = req.params;

    try {
      const users = await User.filter(username);
      console.log('Consulta bem-sucedida. Users encontrados:', users);

      return res.status(200).json(users);

    } catch (error) {
      console.error(error);
      res.status(500).json({
        errors: ['Erro ao buscar usuários.']
      });
    }
  };

  async filterAllUsers(req, res) {
    try {
      const users = await User.readAll();
      console.log('Consulta bem-sucedida. Users encontrados:', users);

      return res.status(200).json(users);

    } catch (error) {
      console.error(error);
      res.status(500).json({
        errors: ['Erro ao buscar usuários.']
      });
    }
  };
}

module.exports = new FilterUserController();
