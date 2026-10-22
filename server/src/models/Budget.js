import mongoose from 'mongoose';

const budgetSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required for budget'],
      index: true,
    },
    category: {
      type: String,
      required: [true, 'Budget category is required'],
      trim: true,
      maxlength: [80, 'Category cannot exceed 80 characters'],
    },
    monthlyLimit: {
      type: Number,
      required: [true, 'Monthly spending limit is required'],
      min: [1, 'Limit must be greater than zero'],
    },
    alertThreshold: {
      type: Number,
      default: 80, // Warn when 80% consumed
      min: [1, 'Threshold must be between 1 and 100'],
      max: [100, 'Threshold must be between 1 and 100'],
    },
  },
  {
    timestamps: true,
  }
);

budgetSchema.index({ userId: 1, category: 1 }, { unique: true });

budgetSchema.methods.toSafeObject = function () {
  return {
    id: this._id.toString(),
    userId: this.userId.toString(),
    category: this.category,
    monthlyLimit: this.monthlyLimit,
    alertThreshold: this.alertThreshold,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};

export const Budget = mongoose.model('Budget', budgetSchema);
export default Budget;
