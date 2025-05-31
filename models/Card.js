import mongoose from "mongoose";

// Citation schema (for sources with label and url)
const CitationSchema = new mongoose.Schema({
  label: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: false,
  }
}, { _id: false });

// Recommendation schema (now an object with just a label)
const RecommendationSchema = new mongoose.Schema({
  label: {
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
  citations: { type: [CitationSchema], default: [] }, // Array of { label, url }
  recommendations: { type: [RecommendationSchema], default: [] }, // Array of { label }
  suggestedQuestions: { type: [String], default: [] },
}, {
  timestamps: true,
});

export default mongoose.models.Card || mongoose.model('Card', CardSchema);