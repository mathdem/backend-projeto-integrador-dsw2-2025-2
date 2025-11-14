
import express from "express";
import cors from "cors";
import usuariosRoutes from "./routes/usuarios.routes.js";
import artesRoutes from "./routes/artes.routes.js"
import {authMiddleware} from "./middlewares/auth.js";

const app = express();

app.use(cors());
// Pega o JSON de dentro da requisição e coloca dentro de req.body
app.use(express.json());

app.use ("/api/usuarios", usuariosRoutes)
app.use ("/api/artes", artesRoutes)


const PORT = process.env.PORT || 3000;


app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});