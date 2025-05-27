import mongoose from "mongoose";

const LinkSchema = new mongoose.Schema({
  label: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  }
}, { _id: false });

const CardSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  rating: {
    type: Number,
    min: 0,
    max: 100,
    default: 0,
  },
  text: {
    type: String,
    required: true,
  },
  citations: [LinkSchema], 
  recommendations: [LinkSchema], 
  suggestedQuestions: [String],
}, {
  timestamps: true,
});

export default mongoose.models.Card || mongoose.model('Card', CardSchema);
