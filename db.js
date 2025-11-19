import mongoose from "mongoose";
import chalk from "chalk";
import "dotenv/config";

// DB Connection
const connectDb = async () => {
  let connectionString = process.env.DB_PROTOCOL;
  if (process.env.DB_USER && process.env.DB_PASS) {
    connectionString += `${process.env.DB_USER}:${process.env.DB_PASS}@`;
  }
  connectionString += `${process.env.DB_HOST}/${process.env.DB_NAME}`;

  mongoose.connect(`${connectionString}${process.env.DB_OPTIONS}`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log(chalk.green("Conected to database")))
    .catch((err) => console.log("Database not connected", err));
};

const disconnectDb = async () => {
  try {
    await mongoose.connection.close();
    console.log(chalk.green("Disconnected from Database"));
  } catch (err) {
    console.log(err);
  }
};

export { connectDb, disconnectDb };