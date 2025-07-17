const mongoose = require('mongoose');

const recodSchema = new mongoose.Schema({
    category : String,
    value : Number
});

module.exports = mongoose.model('Record', recodSchema);