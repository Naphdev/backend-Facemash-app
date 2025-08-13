const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  avatar_img: { type: String },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  actype: { type: String, default: 'user' }
}, { collection: 'account', timestamps: true });

userSchema.statics.findByEmail = function(email) {
  return this.findOne({ email });
};

userSchema.statics.findByUserId = function(userId) {
  return this.findById(userId);
};

userSchema.statics.saveUser = function(user) {
  return this.create(user);
};

userSchema.statics.getCurrentUser = function() {
  return this.find({}, 'name');
};

userSchema.statics.getAccount = function() {
  return this.find();
};

userSchema.statics.updatePassword = function(userId, newPassword) {
  return this.findByIdAndUpdate(userId, { password: newPassword }, { new: true });
};

userSchema.statics.updateName = function(userId, newName) {
  return this.findByIdAndUpdate(userId, { name: newName }, { new: true });
};

userSchema.statics.updateAvatar = function(userId, newAvatarImg) {
  return this.findByIdAndUpdate(userId, { avatar_img: newAvatarImg }, { new: true });
};

userSchema.statics.getAccountById = function(userId) {
  return this.findById(userId);
};

module.exports = mongoose.model('User', userSchema);

