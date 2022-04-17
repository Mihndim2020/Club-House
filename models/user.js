var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var UserSchema = new Schema(
    {
      first_name: {type: String, required: true, maxLength: 100},
      last_name: {type: String, required: true, maxLength: 100},
      email: {type: String, required: true, maxLength: 100},
      user_name: {type: String, maxLength: 100}, // if the username is not provided, use the email address.
      password: {type: String, required: true, maxLength: 100},
      posts: [{type: Schema.Types.ObjectId, ref: 'Post'}],
      member_status: {type: String, required: true, enum: ['Normal', 'admin'], default: 'Normal'}  
    }
  );

  // Virtual for the user's full name

UserSchema
.virtual('name')
.get(function () {
// To avoid errors in cases where an author does not have either a family name or first name
// We want to make sure we handle the exception by returning an empty string for that case
  var fullname = '';
  if (this.first_name && this.last_name) {
    fullname = this.last_name + ', ' + this.first_name
  }
  if (this.first_name && !this.last_name) {
    fullname = this.first_name;
  } 
  if (!this.first_name && this.last_name) {
    fullname = this.last_name;
  }     
  return fullname;
});

// Virtual for user's URL
UserSchema
.virtual('url')
.get(function () {
  return '/members/user/' + this._id;
});

//Export model
module.exports = mongoose.model('User', UserSchema);

