
import express from "express";
import cors from "cors";
import usuariosRoutes from "./routes/usuarios.routes.js";
import artesRoutes from "./routes/artes.routes.js"

const app = express();


// Pega o JSON de dentro da requisição e coloca dentro de req.body
app.use(express.json());

app.use(cors( {origin: true, credentials: true} ));

// armazenamento de arquivos enviados (pasta na raiz /uploads)
// Observação: o Express serve os arquivos como estáticos; a URL pública fica /uploads/<arquivo>.
app.use('/uploads', express.static('./uploads'));

app.use ("/api/usuarios", usuariosRoutes)
app.use ("/api/artes", artesRoutes)


const PORT = process.env.PORT || 3000;


app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});