var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PostSchema = new Schema(
    {
      title: {type: String, required: true},
      user_id: {type: Schema.Types.ObjectId, ref: 'User', required: true},
      author: {type: String, required: true},
      content: {type: String, required: true},
      time_stamp: { type: Date, default: Date.now() }
    }
  );

PostSchema
.virtual('url')
.get(function () {
  return '/members/post/' + this._id;
});

//Export model
module.exports = mongoose.model('Post', PostSchema);