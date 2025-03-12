const express = require("express");
const mongoose = require("mongoose");
const app = express();

app.use(express.json());

mongoose
    .connect("mongodb://mongodb:27017/ordersDB", { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("Conectado ao MongoDB (Orders)"))
    .catch((err) => console.error("Erro ao conectar ao MongoDB", err));

const Order = mongoose.model("Order", new mongoose.Schema({
    product: String,
    quantity: Number,
    price: Number,
}));

app.post("/orders", async (req, res) => {
    const order = new Order(req.body);
    await order.save();
    res.send(order);
});

app.get("/orders", async (req, res) => {
    const orders = await Order.find();
    res.send(orders);
});

app.get("/orders/:id", async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).send("Pedido não encontrado");
    res.send(order);
});

app.delete("/orders/:id", async (req, res) => {
    const result = await Order.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).send("Pedido não encontrado");
    res.send({ message: "Pedido deletado com sucesso!" });
});

const PORT = 3002;

app.listen(PORT, () => console.log(`Servidor Orders rodando na porta ${PORT}`));