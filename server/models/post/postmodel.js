var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');

var Schema = mongoose.Schema;
var postSchema = new Schema({
	author: String,
	message: String,
	created: Date
}, {collection: 'posts'});

postSchema.plugin(mongoosePaginate);

mongoose.model('Post',postSchema);
var Post = mongoose.model('Post');

module.exports = Post;