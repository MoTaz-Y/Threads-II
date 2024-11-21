import mongoose from "mongoose";

let isConnected = false;

export const connectToDB = async () => {
  mongoose.set("strictQuery", true); // to avoid deprecation warning in mongoose or to prevent unknown field query
  if (!process.env.MONGODB_URI)
    return console.log("MONGODB_URI is not defined");
  if (!isConnected) {
    try {
      await mongoose.connect(process.env.MONGODB_URI || "");
      isConnected = true;
      console.log("Connected to MongoDB");
    } catch (error) {
      console.log(error);
    }
  }
};
