// src/routes/chamados.routes.js
import { Router } from "express";
import { unlink } from 'node:fs/promises'; // unlink do fs para apagar arquivo
import { pool } from "../database/db.js";
import multer from "multer"; // import do multer
import path from "path";     // import do path
import fs from "fs";         // import do fs

const router = Router();

// setup mínimo de upload em disco
const uploadDir = path.resolve('uploads');
fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`);
  }
});
const upload = multer({ storage });

// GET api/artes/
router.get("/", async (_req, res) => {
    try {
        // A desestruturação { rows } extrai diretamente o array de resultados do
        // objeto que o pool.query retorna.
        const { rows } = await pool.query(`SELECT * FROM "Artes" ORDER BY "id" DESC`);
        res.status(200).json(rows); // Retorna um array de objetos.
    } catch (error) {
        res.status(500).json({ erro: "Erro interno no servidor." });
    }
});

// -----------------------------------------------------------------------------
// BUSCAR UMA ARTE POR ID (GET /api/artes/:id)
// -----------------------------------------------------------------------------
// Objetivo: Retornar uma arte específica, identificada pelo seu ID.

//GET api/artes/:id
router.get("/:id", async (req, res) => {
    // Parâmetros de rota (req.params) são sempre strings. Convertemos para número.
    const id = Number(req.params.id);

    // Validação de entrada: o ID deve ser um número inteiro e positivo.
    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({ erro: "ID inválido. Deve ser um número inteiro positivo." });
    }

    try {
        // Usamos uma query parametrizada para segurança: $1 é substituído pelo `id`.
        const { rows } = await pool.query(`SELECT * FROM "Artes" WHERE "id" = $1`, [id]);

        // Se o array `rows` estiver vazio, o ID não foi encontrado no banco.
        if (rows.length === 0) {
            return res.status(404).json({ erro: "Arte não encontrada." });
        }

        // Retorna o primeiro (e único) resultado encontrado.
        res.status(200).json(rows[0]);
    } catch (error) {
        res.status(500).json({ erro: "Erro interno no servidor." });
    }
});

// -----------------------------------------------------------------------------
// CRIAR UMA NOVA ARTE (POST /api/artes)
// -----------------------------------------------------------------------------
// Objetivo: Inserir um novo registro na tabela "artes".

//POST api/artes/
router.post("/", upload.single("url_imagem"),async (req, res) => {
    // `req.body ?? {}` garante que, se o body for nulo, teremos um objeto vazio,
    // evitando erros ao tentar desestruturar `undefined`.
    const { Usuarios_id, nome, descricao, palavras_chave, data_concepcao } = req.body ?? {};
    
    const uid = Number(Usuarios_id); // Converte o ID do usuário para número.

    const url_imagem = req.file ? `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}` : null;


    
    // Validação dos campos obrigatórios.
    if (url_imagem == null ||
        nome == null ||
        !Number.isInteger(uid) || uid <= 0) {

        return res.status(400).json({
            erro: "Dados inválidos. Os campos 'url_imagem', 'nome' e 'Usuarios_id' são obrigatórios. 'Usuarios_id' deve ser um número inteiro positivo."
        });
    }

    // 2. Validação de TIPO de todos os campos string (obrigatórios + opcionais)
    // Se um campo opcional existe (não é null/undefined), ele também deve ser string.
    if (typeof url_imagem !== "string" ||
        typeof nome !== "string" ||
        (descricao != null && typeof descricao !== "string") ||
        (palavras_chave != null && typeof palavras_chave !== "string") ||
        (data_concepcao != null && typeof data_concepcao !== "string")) {

        return res.status(400).json({
            erro: "Dados inválidos. Todos os campos textuais (url_imagem, nome, descricao, etc.), se fornecidos, devem ser do tipo string."
        });
    }

    try {
        // A cláusula `RETURNING *` faz com que o PostgreSQL retorne a linha
        // completa que acabou de ser inserida, incluindo o ID gerado.
        const { rows } = await pool.query(
            `INSERT INTO "Artes" ("Usuarios_id", "url_imagem", "nome", "descricao", "palavras_chave", "data_concepcao",) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
            [uid, url_imagem, nome, descricao, palavras_chave, data_concepcao]
        );

        // Retorna o objeto recém-criado com status 201 Created.
        res.status(201).json(rows[0]);
    } catch (error) {
        res.status(500).json({ erro: "Erro interno no servidor." });
    }
});

// -----------------------------------------------------------------------------
// SUBSTITUIR UMA ARTE (PUT /api/artes/:id)
// -----------------------------------------------------------------------------
// Objetivo: Substituir COMPLETAMENTE um registro existente.
// O método PUT espera que o cliente envie todos os campos do recurso.

//PUT /api/artes/:id
router.put("/:id", upload.single("url_imagem"),async (req, res) => {
    const id = Number(req.params.id);
    const { Usuarios_id, nome, descricao, palavras_chave } = req.body ?? {};
    const uid = Number(Usuarios_id);

    const url_imagem = req.file ? `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}` : null;

    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({ erro: "ID de rota inválido. Deve ser um número inteiro positivo." });
    }

    // A validação para PUT é igual à do POST, pois todos os campos são necessários.
    if (!url_imagem || typeof url_imagem !== "string" ||
        !nome || typeof nome !== "string" ||
        !descricao || typeof descricao !== "string" ||
        !palavras_chave || typeof palavras_chave !== "string" ||
        !Number.isInteger(uid) || uid <= 0) {
        return res.status(400).json({
            erro: "Corpo da requisição inválido. Para o método PUT, todos os campos são obrigatórios: 'url_imagem', 'nome', 'descricao', 'palavras_chave' (strings) e 'Usuarios_id' (inteiro positivo)."
        });
    }

    try {
        const { rows } = await pool.query(
            `UPDATE "Artes" SET 
                "Usuarios_id" = $1, 
                "url_imagem" = $2,
                "nome" = $3, 
                "descricao" = $4, 
                "palavras_chave" = $5
             WHERE "id" = $6 
             RETURNING *`,
            [uid, url_imagem, nome, descricao, palavras_chave, id]
        );

        // Se `rows` está vazio, o `id` fornecido não corresponde a nenhum registro.
        if (rows.length === 0) {
            return res.status(404).json({ erro: "Arte não encontrada." });
        }

        res.status(200).json(rows[0]); // Retorna o recurso atualizado.
    } catch (error) {
        res.status(500).json({ erro: "Erro interno no servidor." });
    }
});

// -----------------------------------------------------------------------------
// ATUALIZAR PARCIALMENTE UMA ARTE (PATCH /api/artes/:id)
// -----------------------------------------------------------------------------
// Objetivo: Atualizar APENAS os campos enviados pelo cliente.
// Se um campo não for enviado, seu valor atual no banco de dados será mantido.
//
// Lógica SQL com COALESCE:
// - COALESCE(valor_novo, valor_antigo) retorna o primeiro argumento que não for NULL.
// - No código, se um campo não vem no `req.body` (ex: `nome` é `undefined`),
//   passamos `null` para a query. O `COALESCE($3, nome)` no SQL verá o `$3` como `NULL`
//   e, por isso, manterá o valor que já estava na coluna `nome`.

//PATCH /api/artes/:id
router.patch("/:id", async (req, res) => {
    const id = Number(req.params.id);
    const { Usuarios_id, url_imagem, nome, descricao, palavras_chave } = req.body ?? {};

    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({ erro: "ID inválido. Deve ser um número inteiro positivo." });
    }

    // Verifica se pelo menos um campo foi enviado para atualização.
    if (Usuarios_id === undefined && url_imagem === undefined && nome === undefined &&
        descricao === undefined && palavras_chave === undefined) {
        return res.status(400).json({ erro: "Nenhum campo foi enviado para atualização." });
    }

    // Valida o tipo de `Usuarios_id` apenas se ele foi fornecido.
    if (Usuarios_id !== undefined) {
        const uid = Number(Usuarios_id);
        if (!Number.isInteger(uid) || uid <= 0) {
            return res.status(400).json({ erro: "Se fornecido, 'Usuarios_id' deve ser um número inteiro positivo." });
        }
    }

    try {
        const { rows } = await pool.query(
            `UPDATE "Artes" SET 
                "Usuarios_id" = COALESCE($1, "Usuarios_id"), 
                "url_imagem" = COALESCE($2, "url_imagem"), 
                "nome" = COALESCE($3, "nome"), 
                "descricao" = COALESCE($4, "descricao"), 
                "palavras_chave" = COALESCE($5, "palavras_chave")
             WHERE "id" = $6 
             RETURNING *`,
            // Se um valor for `undefined`, o operador `??` o converte para `null`.
            [Usuarios_id ?? null, url_imagem ?? null, nome ?? null, descricao ?? null, palavras_chave ?? null, id]
        );

        if (rows.length === 0) {
            return res.status(404).json({ erro: "Arte não encontrada." });
        }
        res.status(200).json(rows[0]);
    } catch (error) {
        res.status(500).json({ erro: "Erro interno no servidor." });
    }
});

// -----------------------------------------------------------------------------
// DELETAR UMA ARTE (DELETE /api/artes/:id)
// -----------------------------------------------------------------------------
// Objetivo: Remover um registro existente do banco de dados.
//DELETE /api/artes/:id
router.delete("/:id", async (req, res) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({ erro: "ID inválido. Deve ser um número inteiro positivo." });
    }

    try {
        // `rowCount` informa quantas linhas foram afetadas pela operação.
        const result = await pool.query(`DELETE FROM "Artes" WHERE "id" = $1`, [id]);

        // Se nenhuma linha foi afetada, significa que o `id` não foi encontrado.
        if (result.rowCount === 0) {
            return res.status(404).json({ erro: "Arte não encontrada." });
        }

        // Retorna 204 No Content, indicando sucesso na remoção, sem corpo de resposta.
        res.status(204).end();
    } catch (error) {
        res.status(500).json({ erro: "Erro interno no servidor." });
    }
});

export default router;