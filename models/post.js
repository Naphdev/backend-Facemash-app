const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  body: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { collection: 'posts' });

postSchema.statics.fetchAll = function() {
  return this.find().populate('user');
};

postSchema.statics.savePost = function(post) {
  return this.create(post);
};

postSchema.statics.delete = function(id) {
  return this.findByIdAndDelete(id);
};

module.exports = mongoose.model('Post', postSchema);
