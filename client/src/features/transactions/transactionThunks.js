import { createAsyncThunk } from '@reduxjs/toolkit';
import transactionService from '../../services/transactionService.js';

export const fetchTransactions = createAsyncThunk(
  'transactions/fetchTransactions',
  async (params, { rejectWithValue }) => {
    try {
      const response = await transactionService.getTransactions(params);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch transactions');
    }
  }
);

export const fetchTransactionSummary = createAsyncThunk(
  'transactions/fetchTransactionSummary',
  async (params, { rejectWithValue }) => {
    try {
      const response = await transactionService.getSummary(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch transaction summary');
    }
  }
);

export const createTransaction = createAsyncThunk(
  'transactions/createTransaction',
  async (data, { dispatch, rejectWithValue }) => {
    try {
      const response = await transactionService.createTransaction(data);
      // Automatically refresh summary
      dispatch(fetchTransactionSummary());
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to record transaction');
    }
  }
);

export const updateTransaction = createAsyncThunk(
  'transactions/updateTransaction',
  async ({ id, data }, { dispatch, rejectWithValue }) => {
    try {
      const response = await transactionService.updateTransaction(id, data);
      // Automatically refresh summary
      dispatch(fetchTransactionSummary());
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to update transaction');
    }
  }
);

export const deleteTransaction = createAsyncThunk(
  'transactions/deleteTransaction',
  async (id, { dispatch, rejectWithValue }) => {
    try {
      await transactionService.deleteTransaction(id);
      // Automatically refresh summary
      dispatch(fetchTransactionSummary());
      return id;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to delete transaction');
    }
  }
);

export const importTransactions = createAsyncThunk(
  'transactions/importTransactions',
  async (transactions, { dispatch, rejectWithValue }) => {
    try {
      const response = await transactionService.importTransactions(transactions);
      dispatch(fetchTransactionSummary());
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to import transactions');
    }
  }
);
