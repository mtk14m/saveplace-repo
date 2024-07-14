// @types/express/index.d.ts
import express from 'express';

declare module 'express-serve-static-core' {
  interface Request {
    userId?: string;
    isAdmin?: boolean;
  }
}
