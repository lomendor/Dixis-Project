import mongoose from 'mongoose';

export interface AnnouncementDocument extends mongoose.Document {
  title: string;
  content: string;
  type: 'info' | 'warning' | 'success' | 'error';
  startDate: Date;
  endDate?: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const announcementSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ['info', 'warning', 'success', 'error'],
      default: 'info',
    },
    startDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    endDate: {
      type: Date,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Αυτόματη απενεργοποίηση όταν περάσει η endDate
announcementSchema.pre('save', function (next) {
  if (this.endDate && this.endDate < new Date()) {
    this.isActive = false;
  }
  next();
});

const Announcement = mongoose.model<AnnouncementDocument>('Announcement', announcementSchema);

export default Announcement; 