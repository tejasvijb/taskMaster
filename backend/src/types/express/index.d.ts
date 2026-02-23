// types/express.d.ts

declare global {
  namespace Express {
    interface Request {
      user?: Record<string, string>;
    }
  }
}

export {};
