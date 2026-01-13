import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IComplaint extends Document {
  name: string;
  email: string;
  complaintText: string;
  location?: string;
  imageUrl?: string;
  category: string;
  priority: 'High' | 'Medium' | 'Low';
  department: string;
  status: 'Pending' | 'In Progress' | 'Resolved';
  isDuplicate: boolean;
  duplicateOf?: mongoose.Types.ObjectId;
  createdAt: Date;
}

const ComplaintSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
    },
    complaintText: {
      type: String,
      required: [true, 'Complaint text is required'],
      trim: true,
    },
    location: {
      type: String,
      trim: true,
    },
    imageUrl: {
      type: String,
    },
    category: {
      type: String,
      required: true,
      enum: [
        'Infrastructure',
        'Sanitation',
        'Healthcare',
        'Education',
        'Public Safety',
        'Utilities',
        'Administrative Delay',
      ],
    },
    priority: {
      type: String,
      required: true,
      enum: ['High', 'Medium', 'Low'],
      default: 'Medium',
    },
    department: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: ['Pending', 'In Progress', 'Resolved'],
      default: 'Pending',
    },
    isDuplicate: {
      type: Boolean,
      default: false,
    },
    duplicateOf: {
      type: Schema.Types.ObjectId,
      ref: 'Complaint',
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for faster queries
ComplaintSchema.index({ category: 1, location: 1, createdAt: -1 }); // For duplicate detection
ComplaintSchema.index({ email: 1, createdAt: -1 }); // For email-based queries (most common)
ComplaintSchema.index({ createdAt: -1 }); // For admin queries sorting by date
ComplaintSchema.index({ category: 1 }); // For category filtering
ComplaintSchema.index({ email: 1 }); // For email filtering (covered by compound but explicit for clarity)

const Complaint: Model<IComplaint> =
  mongoose.models.Complaint || mongoose.model<IComplaint>('Complaint', ComplaintSchema);

export default Complaint;

