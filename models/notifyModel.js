const mongoose = require('mongoose');

const NotifySchema = new mongoose.Schema({

    date: { type: Date, default: Date.now },
    userid: { type: String },
    username: { type: String },
    articleid: { type: String },
    articletitle: { type: String },
    message: { type: String },
    chapter: { type: Boolean },
    alert: { type: Boolean, default: true}

});

module.exports = mongoose.model('Notify', NotifySchema);