import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB Connected successfully", process.env.MONGO_URI);
  } catch (error) {
    console.error("Database connection failed");
    process.exit(1);
  }
};

export default connectDB;