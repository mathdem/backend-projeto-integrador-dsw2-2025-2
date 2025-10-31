// server.js
// -----------------------------------------------------------------------------
// OBJETIVO DESTE ARQUIVO
// -----------------------------------------------------------------------------
// Este arquivo cria uma API REST para um CRUD (Create, Read, Update, Delete)
// de "artes", utilizando:
// - Express.js: Framework para servidores HTTP em Node.js.
// - PostgreSQL: Acesso ao banco de dados através de um pool de conexões.
//
// COMO LER ESTE CÓDIGO (PARA INICIANTES):
// - Linhas que começam com // são comentários e não são executadas.
// - "async/await" gerencia operações assíncronas (ex: consultas ao banco).
// - Em cada rota, "req" (request) é o pedido do cliente e "res" (response)
//   é a resposta que o servidor enviará.
// - No final, app.listen(PORT) inicia o servidor para que ele possa receber pedidos.
//
// CÓDIGOS DE STATUS HTTP UTILIZADOS:
// - 200 OK          → Requisição bem-sucedida, retornando dados.
// - 201 Created     → Recurso criado com sucesso (ex: após um POST).
// - 204 No Content  → Operação bem-sucedida, sem conteúdo para retornar (ex: DELETE).
// - 400 Bad Request → O cliente enviou dados inválidos ou malformados.
// - 404 Not Found   → O recurso solicitado não foi encontrado.
// - 500 Internal Server Error → Ocorreu um erro inesperado no servidor.
//
// SEGURANÇA (SQL INJECTION):
// - Usamos "queries parametrizadas" ($1, $2, ...) para evitar ataques de SQL Injection.
//   Ex: pool.query("SELECT * FROM artes WHERE id = $1", [id]);
// - Jamais concatene diretamente dados do usuário em uma string de SQL.
//
// MANIPULAÇÃO DE JSON:
// - app.use(express.json()) é um "middleware" que analisa o corpo (body) de
//   requisições com "Content-Type: application/json" e o transforma em um
//   objeto JavaScript acessível via req.body.
//
// -----------------------------------------------------------------------------
// IMPORTAÇÕES E CONFIGURAÇÃO INICIAL
// -----------------------------------------------------------------------------
import express from "express";
import cors from "cors";
import { pool } from "./db.js"; // "pool" gerencia as conexões com o PostgreSQL.

const app = express();

// Middleware para que o Express entenda JSON no corpo das requisições.
// Sem ele, req.body seria `undefined`.
app.use(cors());
app.use(express.json());

// -----------------------------------------------------------------------------
// ROTA DE BOAS-VINDAS / DOCUMENTAÇÃO RÁPIDA (GET /)
// -----------------------------------------------------------------------------
// Esta rota serve como uma "página inicial" da API, listando os endpoints
// disponíveis para quem acessa a raiz pelo navegador ou outra ferramenta.
app.get("/", (_req, res) => {
    try {
        const endpoints = {
            "LISTAR_TODAS": "GET /api/artes",
            "BUSCAR_POR_ID": "GET /api/artes/:id",
            "CRIAR": "POST /api/artes BODY: { \"Usuarios_id\": number, \"url_imagem\": \"string\", \"nome\": \"string\", \"descricao\": \"string\", \"palavras_chave\": \"string\" }",
            "SUBSTITUIR_COMPLETAMENTE": "PUT /api/artes/:id BODY: { \"Usuarios_id\": number, \"url_imagem\": \"string\", \"nome\": \"string\", \"descricao\": \"string\", \"palavras_chave\": \"string\" }",
            "ATUALIZAR_PARCIALMENTE": "PATCH /api/artes/:id BODY: { /* envie apenas os campos que deseja alterar */ }",
            "DELETAR": "DELETE /api/artes/:id",
        };
        res.status(200).json(endpoints); // Envia o objeto como JSON (status 200 OK)
    } catch (error) {
        // Embora seja raro um erro aqui, é uma boa prática manter o bloco try/catch.
        // Em produção, o erro seria registrado (log) para análise.
        res.status(500).json({ erro: "Erro interno no servidor." });
    }
});

// -----------------------------------------------------------------------------
// LISTAR TODAS AS ARTES (GET /api/artes)
// -----------------------------------------------------------------------------
// Objetivo: Retornar todos os registros da tabela "artes", ordenados do mais
// recente para o mais antigo (por id).
app.get("/api/artes", async (_req, res) => {
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
app.get("/api/artes/:id", async (req, res) => {
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
app.post("/api/artes", async (req, res) => {
    // `req.body ?? {}` garante que, se o body for nulo, teremos um objeto vazio,
    // evitando erros ao tentar desestruturar `undefined`.
    const { Usuarios_id, url_imagem, nome, descricao, palavras_chave } = req.body ?? {};
    const uid = Number(Usuarios_id); // Converte o ID do usuário para número.

    // Validação dos campos obrigatórios.
    if (!url_imagem || typeof url_imagem !== "string" ||
        !nome || typeof nome !== "string" ||
        !descricao || typeof descricao !== "string" ||
        !palavras_chave || typeof palavras_chave !== "string" ||
        !Number.isInteger(uid) || uid <= 0) {
        return res.status(400).json({
            erro: "Dados inválidos. Os campos 'url_imagem', 'nome', 'descricao' e 'palavras_chave' são strings obrigatórias. 'Usuarios_id' deve ser um número inteiro positivo."
        });
    }

    try {
        // A cláusula `RETURNING *` faz com que o PostgreSQL retorne a linha
        // completa que acabou de ser inserida, incluindo o ID gerado.
        const { rows } = await pool.query(
            `INSERT INTO "Artes" ("Usuarios_id", "url_imagem", "nome", "descricao", "palavras_chave") VALUES ($1, $2, $3, $4, $5) RETURNING *`,
            [uid, url_imagem, nome, descricao, palavras_chave]
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
app.put("/api/artes/:id", async (req, res) => {
    const id = Number(req.params.id);
    const { Usuarios_id, url_imagem, nome, descricao, palavras_chave } = req.body ?? {};
    const uid = Number(Usuarios_id);

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
app.patch("/api/artes/:id", async (req, res) => {
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
app.delete("/api/artes/:id", async (req, res) => {
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

// -----------------------------------------------------------------------------
// INICIALIZAÇÃO DO SERVIDOR
// -----------------------------------------------------------------------------
// A porta é obtida da variável de ambiente `PORT` (comum em serviços de
// hospedagem como Heroku), ou usa 3000 como padrão para desenvolvimento local.
const PORT = process.env.PORT || 3000;

// Inicia o servidor HTTP, que ficará "escutando" por novas requisições na porta definida.
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});