const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({

    date: { type: Date, default: Date.now },
    text: { type: String },
    state: { type: Boolean, default: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", require: true },
    article: { type: mongoose.Schema.Types.ObjectId, ref: "Article", default: null },
    chapter: { type: mongoose.Schema.Types.ObjectId, ref: "Chapter", default: null }
    
});

module.exports = mongoose.model('Comment', CommentSchema);