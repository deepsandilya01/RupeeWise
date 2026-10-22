import mongoose from 'mongoose';

export const VALID_ACTIVITY_TYPES = [
  'user_registered',
  'user_login',
  'role_changed',
  'transaction_created',
  'goal_created',
  'budget_created',
  'admin_action',
  'system_event',
];

const activityLogSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: [true, 'Activity type is required'],
      enum: {
        values: VALID_ACTIVITY_TYPES,
        message: '{VALUE} is not a valid activity type',
      },
      index: true,
    },
    actorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
      index: true,
    },
    actorName: {
      type: String,
      default: 'System',
      trim: true,
    },
    actorEmail: {
      type: String,
      default: '',
      trim: true,
    },
    targetUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    targetUserEmail: {
      type: String,
      default: '',
      trim: true,
    },
    summary: {
      type: String,
      required: [true, 'Activity summary is required'],
      trim: true,
      maxlength: [300, 'Summary cannot exceed 300 characters'],
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

activityLogSchema.index({ createdAt: -1 });

activityLogSchema.methods.toSafeObject = function () {
  return {
    id: this._id.toString(),
    type: this.type,
    actorId: this.actorId ? this.actorId.toString() : null,
    actorName: this.actorName,
    actorEmail: this.actorEmail,
    targetUserId: this.targetUserId ? this.targetUserId.toString() : null,
    targetUserEmail: this.targetUserEmail,
    summary: this.summary,
    metadata: this.metadata,
    createdAt: this.createdAt,
  };
};

export const ActivityLog = mongoose.model('ActivityLog', activityLogSchema);
export default ActivityLog;
