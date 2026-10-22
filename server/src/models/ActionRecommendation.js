import mongoose from 'mongoose';

const actionRecommendationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Recommendation title is required'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
    },
    observation: {
      type: String,
      required: [true, 'Observation is required'],
    },
    action: {
      type: String,
      required: [true, 'Suggested action is required'],
    },
    estimatedMonthlySavings: {
      type: Number,
      default: 0,
    },
    estimatedAnnualSavings: {
      type: Number,
      default: 0,
    },
    confidence: {
      type: String,
      enum: ['high', 'medium', 'moderate'],
      default: 'high',
    },
    status: {
      type: String,
      enum: ['active', 'accepted', 'dismissed'],
      default: 'active',
      index: true,
    },
    source: {
      type: String,
      enum: ['rules-based', 'ai-generated'],
      default: 'rules-based',
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

actionRecommendationSchema.index({ userId: 1, status: 1 });
actionRecommendationSchema.index({ userId: 1, createdAt: -1 });

actionRecommendationSchema.methods.toSafeObject = function () {
  return {
    id: this._id.toString(),
    userId: this.userId.toString(),
    title: this.title,
    category: this.category,
    observation: this.observation,
    action: this.action,
    estimatedMonthlySavings: this.estimatedMonthlySavings,
    estimatedAnnualSavings: this.estimatedAnnualSavings,
    confidence: this.confidence,
    status: this.status,
    source: this.source,
    metadata: this.metadata,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};

export const ActionRecommendation = mongoose.model(
  'ActionRecommendation',
  actionRecommendationSchema
);
export default ActionRecommendation;
