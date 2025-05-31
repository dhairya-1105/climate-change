import mongoose from "mongoose";

// Link schema for citations and recommendations
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

// Main Card schema
const CardSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    lowercase: true,
    index: true,
  },
  product: {
    type: String,
    required: true,
    default: "Climate Change Analyzer", // Use your desired product name here
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