const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: String,
    description: String,
    link: String,
    ecoLabels: [String],
});

module.exports = mongoose.model('Product', productSchema);