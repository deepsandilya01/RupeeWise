import mongoose from 'mongoose';

export const VALID_TRANSACTION_TYPES = ['income', 'expense'];

export const VALID_CATEGORIES = [
  'Food & Dining',
  'Shopping',
  'Housing & Rent',
  'Transport & Fuel',
  'Utilities',
  'Subscriptions & Entertainment',
  'Salary & Income',
  'Investments & Savings',
  'Health & Medical',
  'Education',
  'Travel',
  'Other',
];

export const VALID_PAYMENT_METHODS = [
  'UPI',
  'Net Banking',
  'Credit Card',
  'Debit Card',
  'Cash',
  'Other',
];

const transactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Transaction user ID is required'],
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Transaction title or merchant name is required'],
      trim: true,
      maxlength: [120, 'Title cannot exceed 120 characters'],
    },
    amount: {
      type: Number,
      required: [true, 'Transaction amount is required'],
      min: [0.01, 'Amount must be greater than zero'],
    },
    type: {
      type: String,
      required: [true, 'Transaction type is required'],
      enum: {
        values: VALID_TRANSACTION_TYPES,
        message: '{VALUE} is not a valid transaction type (must be income or expense)',
      },
      lowercase: true,
      index: true,
    },
    category: {
      type: String,
      required: [true, 'Transaction category is required'],
      trim: true,
      maxlength: [80, 'Category cannot exceed 80 characters'],
      index: true,
    },
    date: {
      type: Date,
      required: [true, 'Transaction date is required'],
      default: Date.now,
      index: true,
    },
    paymentMethod: {
      type: String,
      enum: {
        values: VALID_PAYMENT_METHODS,
        message: '{VALUE} is not a valid payment method',
      },
      default: 'UPI',
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes for optimal scoped performance
transactionSchema.index({ userId: 1, date: -1 });
transactionSchema.index({ userId: 1, type: 1 });
transactionSchema.index({ userId: 1, category: 1 });
transactionSchema.index({ userId: 1, createdAt: -1 });

// Helper to return clean formatted object
transactionSchema.methods.toSafeObject = function () {
  return {
    id: this._id.toString(),
    userId: this.userId.toString(),
    title: this.title,
    amount: this.amount,
    type: this.type,
    category: this.category,
    date: this.date,
    paymentMethod: this.paymentMethod,
    description: this.description,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};

export const Transaction = mongoose.model('Transaction', transactionSchema);
export default Transaction;
