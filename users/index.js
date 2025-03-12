const express = require("express");
const mongoose = require("mongoose");
const app = express();

app.use(express.json());

mongoose
    .connect("mongodb://mongodb:27017/usersDB", { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("Conectado ao MongoDB (Users)"))
    .catch((err) => console.error("Erro ao conectar ao MongoDB", err));

const User = mongoose.model("User", new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String
}));

app.post("/users", async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();
        res.send(user);

    } catch (err) {
        res.status(400).send({ error: "Erro ao criar usuário", details: err.message });
    }
});

app.get("/users", async (req, res) => {
    const users = await User.find();
    res.send(users);
});

app.get("/users/:id", async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).send("Usuário não encontrado");
    res.send(user);

});

app.put("/users/:id", async (req, res) => {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!user) return res.status(404).send("Usuário não encontrado");
    res.send(user);

});

app.delete("/users/:id", async (req, res) => {
    const result = await User.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).send("Usuário não encontrado");
    res.send({ message: "Usuário deletado com sucesso!" });

});


const PORT = 3001;

app.listen(PORT, () => console.log(`Servidor Users rodando na porta ${PORT}`));