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

// CORS configuration
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
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

// app.listen(port, () =>
//   console.log(`Server running on http://localhost:${port}`)
// );

export default app;
