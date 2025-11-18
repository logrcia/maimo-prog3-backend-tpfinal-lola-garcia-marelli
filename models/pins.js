import mongoose from "mongoose";
const Schema = mongoose.Schema;

const commentsSchema = new mongoose.Schema({
  user: String,
  comment: String,
  date: { type: Date, default: Date.now }
});


const pinSchema = new Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  region: { type: String },
  description: { type: String },
  visualStyle: { type: String, required: true },
  image: { type: [String], required: true },
  colorPalette: { type: [String] }, 
  fonts: { type: [String] },
  software: { type: [String] }, 
  categories: [{ type: Schema.Types.ObjectId, ref:"Category"}],
  comments: [commentsSchema]
});

export default mongoose.model("Pin", pinSchema, "pins");
