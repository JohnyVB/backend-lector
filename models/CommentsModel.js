const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({

    date: { type: Date, default: Date.now },
    text: { type: String },
    userid: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
    
});

module.exports = mongoose.model('Comment', CommentSchema);