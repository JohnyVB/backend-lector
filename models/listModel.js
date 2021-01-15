const mongoose = require('mongoose');

const ListSchema = new mongoose.Schema({
    name: { type: String },
    date: { type: Date, default: Date.now },
    articleid: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Article', default: null }]
});

module.exports = mongoose.model('List', ListSchema);