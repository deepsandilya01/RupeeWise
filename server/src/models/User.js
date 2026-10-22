import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'User name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'User email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        'Please provide a valid email address',
      ],
    },
    googleId: {
      type: String,
      default: undefined,
    },
    passwordHash: {
      type: String,
      default: null,
      select: false,
    },
    picture: {
      type: String,
      default: '',
    },
    role: {
      type: String,
      enum: {
        values: ['client', 'admin'],
        message: '{VALUE} is not a valid role',
      },
      default: 'client',
      index: true,
    },
    isDemo: {
      type: Boolean,
      default: false,
      index: true,
    },
    authMethod: {
      type: String,
      enum: ['google', 'local', 'demo'],
      default: 'local',
    },
  },
  {
    timestamps: true,
  }
);

// Ensure googleId is unique only when it is a non-null string
userSchema.index(
  { googleId: 1 },
  { unique: true, partialFilterExpression: { googleId: { $type: 'string' } } }
);

// Method to return safe public profile (never exposes passwordHash)
userSchema.methods.toSafeObject = function () {
  return {
    id: this._id.toString(),
    name: this.name,
    email: this.email,
    picture: this.picture,
    role: this.role,
    isDemo: Boolean(this.isDemo),
    authMethod: this.authMethod || (this.googleId ? 'google' : 'local'),
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};

export const User = mongoose.model('User', userSchema);
export default User;
