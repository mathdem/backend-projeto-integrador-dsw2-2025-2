import { Router } from "express";
import { pool } from "../database/db.js";
import multer from "multer";
import path from "path";
import fs from "fs";

const router = Router();

// Configuração do Multer
const uploadDir = path.resolve('uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`);
  }
});
const upload = multer({ storage });

// GET: Listar todas as artes
router.get("/", async (_req, res) => {
    try {
        const { rows } = await pool.query(`SELECT * FROM "Artes" ORDER BY "id" DESC`);
        res.status(200).json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ erro: "Erro interno no servidor." });
    }
});

// GET: Buscar uma arte por ID
router.get("/:id", async (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({ erro: "ID inválido." });
    }

    try {
        const { rows } = await pool.query(`SELECT * FROM "Artes" WHERE "id" = $1`, [id]);
        if (rows.length === 0) return res.status(404).json({ erro: "Arte não encontrada." });
        res.status(200).json(rows[0]);
    } catch (error) {
        res.status(500).json({ erro: "Erro interno no servidor." });
    }
});

// POST: Criar nova arte (CORRIGIDO)
router.post("/", upload.single("url_imagem"), async (req, res) => {
    const { Usuarios_id, nome, descricao, palavras_chave, data_concepcao } = req.body ?? {};
    const uid = Number(Usuarios_id);

    // Constrói a URL da imagem se o arquivo existir
    const url_imagem = req.file ? `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}` : null;

    if (!url_imagem || !nome || !Number.isInteger(uid)) {
        return res.status(400).json({ erro: "Dados inválidos. Imagem, nome e ID do usuário são obrigatórios." });
    }

    try {
        // CORREÇÃO: Removida a vírgula extra após "data_concepcao" na query SQL
        const { rows } = await pool.query(
            `INSERT INTO "Artes" ("Usuarios_id", "url_imagem", "nome", "descricao", "palavras_chave", "data_concepcao") VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
            [uid, url_imagem, nome, descricao, palavras_chave, data_concepcao]
        );
        res.status(201).json(rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ erro: "Erro ao salvar no banco." });
    }
});

// PUT: Atualizar arte (CORRIGIDO)
router.put("/:id", upload.single("url_imagem"), async (req, res) => {
    const id = Number(req.params.id);
    const { Usuarios_id, nome, descricao, palavras_chave } = req.body ?? {};
    const uid = Number(Usuarios_id);

    // Se veio arquivo novo, cria URL. Se não, é null.
    const url_imagem_nova = req.file ? `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}` : null;

    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({ erro: "ID inválido." });
    }

    try {
        // CORREÇÃO: Usamos COALESCE($2, "url_imagem"). 
        // Se url_imagem_nova ($2) for null, o banco mantém o valor antigo ("url_imagem").
        const { rows } = await pool.query(
            `UPDATE "Artes" SET 
                "Usuarios_id" = $1, 
                "url_imagem" = COALESCE($2, "url_imagem"),
                "nome" = $3, 
                "descricao" = $4, 
                "palavras_chave" = $5
             WHERE "id" = $6 
             RETURNING *`,
            [uid, url_imagem_nova, nome, descricao, palavras_chave, id]
        );

        if (rows.length === 0) return res.status(404).json({ erro: "Arte não encontrada." });
        res.status(200).json(rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ erro: "Erro interno no servidor." });
    }
});

// DELETE: Deletar arte
router.delete("/:id", async (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) return res.status(400).json({ erro: "ID inválido." });

    try {
        const result = await pool.query(`DELETE FROM "Artes" WHERE "id" = $1`, [id]);
        if (result.rowCount === 0) return res.status(404).json({ erro: "Arte não encontrada." });
        res.status(204).end();
    } catch (error) {
        res.status(500).json({ erro: "Erro interno." });
    }
});

export default router;