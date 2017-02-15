// Require mongoose
var mongoose = require("mongoose");
// Create a Schema class with mongoose
var Schema = mongoose.Schema;
// Create a Commentchema with the Schema class
var CommentSchema = new Schema({
    name: {
        type: String
    },
    body: {
        type: String
    }
});
// Make a Comment model with the Commentchema
var Comment = mongoose.model("Comment", CommentSchema);
// Export the Comment model
module.exports = Comment;