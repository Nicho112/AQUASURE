import { testConnection } from "./db";

testConnection()
  .then((result) => {
    console.log("Database connected successfully:", result);
  })
  .catch((error) => {
    console.error("Database connection failed:", error);
  });