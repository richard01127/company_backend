import mongoose from 'mongoose';

const submissionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  hearAboutUs: {
    type: String,
    required: true
  },
  goal: {
    type: String,
    required: true
  },
  budget: {
    type: String,
    required: true
  },
  technicalInfo: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

export default mongoose.model('Submission', submissionSchema);