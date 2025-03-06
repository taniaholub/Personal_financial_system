import express from "express";
import userRoutes from "./app/user.routes";

const app = express(); // Initialize the express application

app.use(express.json()); // Middleware to parse JSON bodies
app.use("/users", userRoutes);

const PORT = 5500;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
