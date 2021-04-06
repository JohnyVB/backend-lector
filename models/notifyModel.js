const mongoose = require('mongoose');

const NotifySchema = new mongoose.Schema({

    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, default: Date.now },
    alert: { type: Boolean, default: true},
    userPost: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    data: {
        title: { type: String },
        article: { type: mongoose.Schema.Types.ObjectId, ref: 'Article', default: null },
        chapter: { type: mongoose.Schema.Types.ObjectId, ref: 'Chapter', default: null }
    }

});

module.exports = mongoose.model('Notify', NotifySchema);