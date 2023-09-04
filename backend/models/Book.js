const mongoose = require("mongoose");
const { Schema } = mongoose;

const BookModel = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  name: { type: String, required: true },

  category: { type: String, required: true },
  
  isDefault: {
    type: Boolean,
    default: false, // Set to false for user-specific books
  },
});

module.exports = mongoose.model("books", BookModel);
