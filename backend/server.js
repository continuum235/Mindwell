import path from 'path';
import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { connectDB } from './config/db.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import userRoutes from './routes/userRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import journalRoutes from './routes/journalRoutes.js';
import moodRoutes from './routes/moodRoutes.js';

const port = process.env.PORT || 5000;
const app = express();

// First connect DB once, not on every request
await connectDB();

// CORS configuration - Allow multiple origins
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'https://mindwell-liard.vercel.app',
  process.env.CLIENT_URL
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or Postman)
      if (!origin) return callback(null, true);
      
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg = 'The CORS policy for this site does not allow access from the specified origin.';
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// API routes
app.use('/api/users', userRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/journal', journalRoutes);
app.use('/api/mood', moodRoutes);

// Error Handling
app.use(notFound);
app.use(errorHandler);

app.listen(port, () =>
  console.log(`Server running on http://localhost:${port}`)
);

