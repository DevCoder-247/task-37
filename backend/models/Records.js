const mongoose = require('mongoose');

const recordSchema = new mongoose.Schema({
  category: String,
  value: Number
}, { timestamps: true });

module.exports = mongoose.model('Record', recordSchema);