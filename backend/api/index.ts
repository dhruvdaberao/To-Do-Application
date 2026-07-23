import app from '../src/app';
import connectDB from '../src/config/database';

// Establish database connection immediately when the serverless function spins up
// Mongoose buffers operations internally until the connection is established.
connectDB();

export default app;
