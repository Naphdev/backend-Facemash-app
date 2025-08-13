const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  image_url: { type: String, required: true },
  facemash_id: { type: String, required: true },
  points: { type: Number, default: 0 }
}, { collection: 'images', timestamps: true });

imageSchema.statics.fetchAll = function() {
  return this.aggregate([
    {
      $lookup: {
        from: 'account',
        let: { 
          uid: { 
            $cond: {
              if: { $and: [
                { $ne: ['$facemash_id', null] },
                { $ne: ['$facemash_id', ''] },
                { $ne: ['$facemash_id', 'undefined'] }
              ]},
              then: { $toObjectId: '$facemash_id' },
              else: null
            }
          }
        },
        pipeline: [
          { 
            $match: { 
              $expr: { 
                $and: [
                  { $ne: ['$$uid', null] },
                  { $eq: ['$_id', '$$uid'] }
                ]
              } 
            } 
          },
          { $project: { name: 1, avatar_img: 1 } }
        ],
        as: 'user'
      }
    },
    { $unwind: { path: '$user', preserveNullAndEmptyArrays: true } },
    {
      $project: {
        _id: 1,
        image_url: 1,
        facemash_id: 1,
        points: 1,
        createdAt: 1,
        name: { $ifNull: ['$user.name', 'Unknown'] },
        avatar_img: { $ifNull: ['$user.avatar_img', ''] }
      }
    }
  ]);
};

imageSchema.statics.updatePoints = function(imageId, newPoints) {
  return this.findByIdAndUpdate(imageId, { points: newPoints }, { new: true });
};

imageSchema.statics.fetchTopTen = function() {
  return this.aggregate([
    {
      $lookup: {
        from: 'account',
        let: { 
          uid: { 
            $cond: {
              if: { $and: [
                { $ne: ['$facemash_id', null] },
                { $ne: ['$facemash_id', ''] },
                { $ne: ['$facemash_id', 'undefined'] }
              ]},
              then: { $toObjectId: '$facemash_id' },
              else: null
            }
          }
        },
        pipeline: [
          { 
            $match: { 
              $expr: { 
                $and: [
                  { $ne: ['$$uid', null] },
                  { $eq: ['$_id', '$$uid'] }
                ]
              } 
            } 
          },
          { $project: { name: 1, avatar_img: 1 } }
        ],
        as: 'user'
      }
    },
    { $unwind: { path: '$user', preserveNullAndEmptyArrays: true } },
    {
      $project: {
        _id: 1,
        image_url: 1,
        facemash_id: 1,
        points: 1,
        createdAt: 1,
        name: { $ifNull: ['$user.name', 'Unknown'] },
        avatar_img: { $ifNull: ['$user.avatar_img', ''] }
      }
    },
    { $sort: { points: -1 } },
    { $limit: 10 }
  ]);
};

imageSchema.statics.onlyone = function(aid) {
  return this.find({ facemash_id: aid });
};

imageSchema.statics.findimage = function(mid) {
  return this.findById(mid);
};

imageSchema.statics.addImage = function(image_url, facemash_id) {
  return this.create({ image_url, facemash_id });
};

imageSchema.statics.delete = function(id) {
  return this.deleteOne({ _id: id });
};

imageSchema.statics.fetchAllByUserId = function(userId) {
  return this.find({ facemash_id: userId });
};

imageSchema.statics.fetchAllByFacemashId = function(facemashId) {
  return this.find({ facemash_id: facemashId });
};

imageSchema.statics.changeImage = function(image_url, image_id) {
  return this.findByIdAndUpdate(image_id, { image_url, points: 1500 }, { new: true });
};

imageSchema.statics.fetchTopTenUser = function() {
  return this.fetchTopTen();
};

module.exports = mongoose.model('Image', imageSchema);


