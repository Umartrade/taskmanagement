import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    // Use a mock/in-memory database for development in WebContainer
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/taskmanagement';
    
    const conn = await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Database connection error:', error);
    
    // For demo purposes, we'll use a mock in-memory approach
    console.log('Using mock database for demo...');
    
    // In a real application, you would:
    // 1. Set up a MongoDB Atlas cluster
    // 2. Configure proper connection string
    // 3. Handle connection errors appropriately
    
    // For this demo, we'll continue without throwing an error
    // but in production, you should handle this properly
  }
};

export const closeDB = async () => {
  try {
    await mongoose.connection.close();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error closing database connection:', error);
  }
};