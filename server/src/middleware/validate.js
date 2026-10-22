import { z } from 'zod';

export const validateBody = (schema) => {
  return (req, res, next) => {
    try {
      req.body = schema.parse(req.body);
      return next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: error.errors.map((e) => ({
            field: e.path.join('.'),
            message: e.message,
          })),
        });
      }
      return next(error);
    }
  };
};

export const googleAuthSchema = z.object({
  credential: z
    .string({
      required_error: 'Google credential token is required',
    })
    .min(10, 'Credential token must be at least 10 characters long'),
});
