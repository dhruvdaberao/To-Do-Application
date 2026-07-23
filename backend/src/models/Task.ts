import mongoose, { Schema } from 'mongoose';

const taskSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 100,
      trim: true,
    },
    description: {
      type: String,
      maxlength: 500,
      trim: true,
    },
    dateTime: {
      type: Date,
      required: true,
    },
    deadline: {
      type: Date,
      required: true,
    },
    priority: {
      type: String,
      enum: ['LOW', 'MEDIUM', 'HIGH'],
      default: 'MEDIUM',
    },
    completed: {
      type: Boolean,
      default: false,
    },
    category: {
      type: String,
      enum: ['Work', 'Personal', 'College', 'Shopping', 'Health', 'Other', 'General'],
      default: 'General',
    },
  },
  {
    timestamps: true,
  }
);

export const Task = mongoose.model('Task', taskSchema);
