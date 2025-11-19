import mongoose from "mongoose";
import chalk from "chalk";
import "dotenv/config";

const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log(chalk.green("Connected to database"));
  } catch (err) {
    console.log("Database not connected", err);
  }
};

export { connectDb };