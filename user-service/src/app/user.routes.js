const express = require("express"); 
const { registerUser, loginUser } = require("./user.controller");

const router = express.Router(); // Створення маршрутизатора

// Визначення маршрутів
router.post("/register", registerUser);
router.post("/login", loginUser);

module.exports = router;
