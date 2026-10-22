import mongoose from 'mongoose';

const goalSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required for goal'],
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Goal name is required'],
      trim: true,
      maxlength: [100, 'Goal name cannot exceed 100 characters'],
    },
    targetAmount: {
      type: Number,
      required: [true, 'Target amount is required'],
      min: [1, 'Target amount must be at least ₹1'],
    },
    currentAmount: {
      type: Number,
      default: 0,
      min: [0, 'Current amount cannot be negative'],
    },
    targetDate: {
      type: Date,
      default: null,
    },
    monthlyContribution: {
      type: Number,
      default: 0,
      min: [0, 'Monthly contribution cannot be negative'],
    },
    category: {
      type: String,
      enum: ['Travel', 'Technology', 'Emergency Fund', 'Vehicle', 'Home', 'Education', 'Investment', 'Other'],
      default: 'Other',
    },
    imageUrl: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['in_progress', 'completed', 'paused'],
      default: 'in_progress',
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

goalSchema.index({ userId: 1, status: 1 });
goalSchema.index({ userId: 1, createdAt: -1 });

goalSchema.methods.toSafeObject = function () {
  const target = this.targetAmount || 1;
  const current = this.currentAmount || 0;
  const progressPercentage = Math.min(100, Math.round((current / target) * 100));
  const remainingAmount = Math.max(0, target - current);

  // Estimate months remaining based on monthly contribution
  let estimatedMonthsRemaining = null;
  if (this.monthlyContribution > 0 && remainingAmount > 0) {
    estimatedMonthsRemaining = Math.ceil(remainingAmount / this.monthlyContribution);
  }

  return {
    id: this._id.toString(),
    userId: this.userId.toString(),
    name: this.name,
    targetAmount: this.targetAmount,
    currentAmount: this.currentAmount,
    targetDate: this.targetDate,
    monthlyContribution: this.monthlyContribution,
    category: this.category,
    imageUrl: this.imageUrl,
    status: this.status,
    progressPercentage,
    remainingAmount,
    estimatedMonthsRemaining,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};

export const Goal = mongoose.model('Goal', goalSchema);
export default Goal;
