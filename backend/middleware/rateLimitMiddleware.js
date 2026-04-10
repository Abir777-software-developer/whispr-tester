import rateLimit from "express-rate-limit";

// 1. Auth Limiter: Protects Signup and Login from brute-force
export const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // Limit each IP to 10 attempts per hour
  message: {
    message: "Too many login/signup attempts. Please try again after an hour.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// 2. AI Summarize Limiter: Protects Gemini API resource usage
export const aiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 summaries per 15 minutes
  message: {
    message: "Too many AI summaries requested. Please wait 15 minutes before the next one.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// 3. Messaging Limiter: Prevents chat spamming
export const messageLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30, // Limit each IP to 30 messages per minute
  message: {
    message: "You are sending messages too fast. Please slow down.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// 4. Search Limiter: Protects DB query performance
export const searchLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 20, // Limit each IP to 20 searches per minute
  message: {
    message: "Too many searches. Please try again in a minute.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});
