const express = require("express");
const app = express();

app.get("/", (_, res) => res.send("Головна сторінка"));
app.get("/about", (_, res) => res.send("Сторінка 'Про нас'"));
app.post("/users", (_, res) => res.send("Користувач створений"));
app.post("/users/register", (_, res) => res.send("Реєстрація нового користувача"));
app.post("/users/login", (_, res) => res.send("Aвторизація користувача"));
app.put("/users/:id", (req, res) => res.send(`Оновлення користувача ${req.params.id}`))
app.delete("/users/:id", (req, res) => res.send(`Видалення користувача ${req.params.id}`))

const PORT = 5500;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});