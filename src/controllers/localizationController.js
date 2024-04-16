const path = require('path');

const Localization = require(path.resolve(__dirname, '..', 'models', 'userLocalization'));

class LocalizationController {
  async create(req, res) {
    const localization = new Localization(req.body);

    localization.create();
    return res.status(200).json({
      message: 'Localização criada com sucesso!',
      payload: localization
    });
  };

  async readByUser(req, res) {
    const user = req.params.id;
    const localization = await Localization.readByUser(user);
    return res.status(200).json(localization);
  };

  async update(req, res) {
    const localization = Localization.update(req.params.id, req.body);
    return res.status(200).json({
      message: 'Localização atualizada com sucesso!',
      payload: localization
    });
  };

  async delete(req, res) {
    const postID = req.params.id;
    const localization = await Localization.delete(postID);
    return res.status(200).json({
      message: 'Localização deletada com sucesso!',
      payload: localization
    });
  };
}

module.exports = new LocalizationController();