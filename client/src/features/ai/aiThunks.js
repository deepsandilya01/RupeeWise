import { createAsyncThunk } from '@reduxjs/toolkit';
import aiService from '../../services/aiService.js';
import goalService from '../../services/goalService.js';
import budgetService from '../../services/budgetService.js';

export const fetchAIInsights = createAsyncThunk(
  'ai/fetchAIInsights',
  async (_, { rejectWithValue }) => {
    try {
      const response = await aiService.getInsights();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch financial insights');
    }
  }
);

export const fetchRecommendations = createAsyncThunk(
  'ai/fetchRecommendations',
  async (_, { rejectWithValue }) => {
    try {
      const response = await aiService.getRecommendations();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch recommendations');
    }
  }
);

export const updateRecommendationStatus = createAsyncThunk(
  'ai/updateRecommendationStatus',
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const response = await aiService.updateRecommendationStatus(id, status);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to update recommendation');
    }
  }
);

export const runSimulation = createAsyncThunk(
  'ai/runSimulation',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await aiService.simulate(payload);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to run simulation');
    }
  }
);

export const askAICoach = createAsyncThunk(
  'ai/askAICoach',
  async (message, { rejectWithValue }) => {
    try {
      const response = await aiService.askCoach(message);
      return { query: message, ...response.data };
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to query AI coach');
    }
  }
);

export const fetchGoals = createAsyncThunk(
  'ai/fetchGoals',
  async (_, { rejectWithValue }) => {
    try {
      const response = await goalService.listGoals();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch savings goals');
    }
  }
);

export const createGoal = createAsyncThunk(
  'ai/createGoal',
  async (data, { dispatch, rejectWithValue }) => {
    try {
      const response = await goalService.createGoal(data);
      dispatch(fetchGoals());
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to create goal');
    }
  }
);

export const addGoalContribution = createAsyncThunk(
  'ai/addGoalContribution',
  async ({ id, amount }, { dispatch, rejectWithValue }) => {
    try {
      const response = await goalService.addContribution(id, amount);
      dispatch(fetchGoals());
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to contribute to goal');
    }
  }
);

export const deleteGoal = createAsyncThunk(
  'ai/deleteGoal',
  async (id, { dispatch, rejectWithValue }) => {
    try {
      await goalService.deleteGoal(id);
      dispatch(fetchGoals());
      return id;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to delete goal');
    }
  }
);

export const fetchBudgets = createAsyncThunk(
  'ai/fetchBudgets',
  async (_, { rejectWithValue }) => {
    try {
      const response = await budgetService.getBudgets();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch budgets');
    }
  }
);

export const setBudget = createAsyncThunk(
  'ai/setBudget',
  async (data, { dispatch, rejectWithValue }) => {
    try {
      const response = await budgetService.setBudget(data);
      dispatch(fetchBudgets());
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to save budget');
    }
  }
);
