const express = require("express");
const mongoose = require("mongoose");
const app = express();

app.use(express.json());

mongoose
    .connect("mongodb://mongodb:27017/paymentsDB", { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("Conectado ao MongoDB (Payments)"))
    .catch((err) => console.error("Erro ao conectar ao MongoDB", err));

const Payment = mongoose.model("Payment", new mongoose.Schema({
    orderId: String,
    amount: Number,
    status: { type: String, enum: ["pending", "completed", "failed"], default: "pending" },
    method: String
}));

app.post("/payments", async (req, res) => {
    const payment = new Payment(req.body);
    await payment.save();
    res.send(payment);
});

app.get("/payments", async (req, res) => {
    const payments = await Payment.find();
    res.send(payments);
});

app.get("/payments/:id", async (req, res) => {
    const payment = await Payment.findById(req.params.id);
    if (!payment) return res.status(404).send("Pagamento não encontrado");
    res.send(payment);
});

app.put("/payments/:id", async (req, res) => {
    const payment = await Payment.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!payment) return res.status(404).send("Pagamento não encontrado");
    res.send(payment);
});

app.delete("/payments/:id", async (req, res) => {
    const result = await Payment.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).send("Pagamento não encontrado");
    res.send({ message: "Pagamento deletado com sucesso!" });
});

const PORT = 3003;

app.listen(PORT, () => console.log(`Servidor Payments rodando na porta ${PORT}`));