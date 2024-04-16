const path = require('path');

const Localization = require(path.resolve(__dirname, '..', 'models', 'userLocalization'));

class LocalizationController {
  async create(req, res) {
    console.log(req.body);
    const localization = await new Localization(req.body);
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

  async destroy(req, res) {
    const postID = req.params.id;
    const localization = await Localization.delete(postID);
    return res.status(200).json({
      message: 'Localização deconstada com sucesso!',
      payload: localization
    });
  };
}

module.exports = new LocalizationController();