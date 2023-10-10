import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.DATABASE_URL);
    if (conn) {
      console.log(`Connected to DB: ${conn.connection.host}`);
    }
  } catch (error) {
    console.log(error.message);
  }
};

export default connectDB;
