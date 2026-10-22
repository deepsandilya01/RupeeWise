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
      required: [true, 'Google ID is required'],
      unique: true,
      index: true,
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
  },
  {
    timestamps: true,
  }
);

// Method to return safe public profile
userSchema.methods.toSafeObject = function () {
  return {
    id: this._id.toString(),
    name: this.name,
    email: this.email,
    picture: this.picture,
    role: this.role,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};

export const User = mongoose.model('User', userSchema);
export default User;
