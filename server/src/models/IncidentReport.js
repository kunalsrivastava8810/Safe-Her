import mongoose from 'mongoose';

const incidentReportSchema = new mongoose.Schema(
  {
    referenceId: {
      type: String,
      required: true,
      unique: true,
    },
    incidentType: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 4000,
    },
    contact: {
      type: String,
      trim: true,
      default: '',
    },
    evidence: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

export const IncidentReport = mongoose.model('IncidentReport', incidentReportSchema);
