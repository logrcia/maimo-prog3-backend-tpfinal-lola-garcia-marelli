import mongoose from "mongoose";
const Schema = mongoose.Schema;

const boardSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String },
  pins: [{ type: Schema.Types.ObjectId, ref: 'Pin', qty: Number }], // Array de referencias a pins
});

export default mongoose.model("Board", boardSchema, "boards");