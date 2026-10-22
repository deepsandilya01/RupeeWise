import jwt from 'jsonwebtoken';
import config from '../config/env.js';

/**
 * Generate a signed JWT for an authenticated user session
 * @param {Object} payload - { userId: string, role: string }
 * @returns {string} Signed JWT
 */
export const generateToken = (payload) => {
  if (!config.JWT_SECRET) {
    throw new Error('JWT_SECRET is not configured on the server');
  }

  return jwt.sign(
    {
      sub: payload.userId,
      role: payload.role,
    },
    config.JWT_SECRET,
    {
      expiresIn: config.JWT_EXPIRES_IN,
    }
  );
};

/**
 * Verify and decode a session JWT
 * @param {string} token
 * @returns {Object} Decoded token payload
 */
export const verifyToken = (token) => {
  if (!config.JWT_SECRET) {
    throw new Error('JWT_SECRET is not configured on the server');
  }

  return jwt.verify(token, config.JWT_SECRET);
};

/**
 * Build standard secure cookie options
 * @returns {Object} express cookie options
 */
export const getCookieOptions = () => {
  return {
    httpOnly: true,
    secure: config.isProduction, // true only in production HTTPS
    sameSite: config.isProduction ? 'lax' : 'lax',
    maxAge: config.COOKIE_MAX_AGE_MS,
    path: '/',
  };
};

/**
 * Set session cookie on Express response
 * @param {import('express').Response} res
 * @param {string} token
 */
export const setAuthCookie = (res, token) => {
  res.cookie(config.COOKIE_NAME, token, getCookieOptions());
};

/**
 * Clear session cookie on Express response
 * @param {import('express').Response} res
 */
export const clearAuthCookie = (res) => {
  res.clearCookie(config.COOKIE_NAME, {
    httpOnly: true,
    secure: config.isProduction,
    sameSite: config.isProduction ? 'lax' : 'lax',
    path: '/',
  });
};

export default {
  generateToken,
  verifyToken,
  getCookieOptions,
  setAuthCookie,
  clearAuthCookie,
};
