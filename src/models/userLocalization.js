const mongoose = require('mongoose');

const LocalizationSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  lat: {type: String, required: true},
  lon: { type: String, required: true },
});

const LocalizationModel = mongoose.model('UserLocalization', LocalizationSchema);

class Localization {
  constructor(body) {
    this.body = body;
    this.errors = [];
    this.localization = null;
  }

  async create() {
    this.localization = await LocalizationModel.create(this.body);
  }

  static async readByUser(userID) {
    if (typeof userID !== 'string') return;
    return await LocalizationModel.find({ 'userID': userID });
  }

  static async update(id, body) {
    if (typeof id !== 'string') return;

    const localization = await LocalizationModel.findById(id);
    let newLat = body.latitude ? body.latitude : localization.latitude;
    let newLon = body.longitude ? body.longitude : localization.longitude;

    const edit = {
      lat: newLat,
      lon: newLon
    };
    return await LocalizationModel.findByIdAndUpdate(id, edit, { new: true });
  }

  static async delete(id) {
    if (typeof id !== 'string') return;
    return await LocalizationModel.findByIdAndDelete(id);
  }
}

module.exports = Localization;
