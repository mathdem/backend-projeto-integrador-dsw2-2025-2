# [Título do seu projeto]
<!-- EXEMPLO: "AtendeAí — Fila de Ajuda em Sala" -->

## 1) Problema
<!-- Escreva o problema sem falar de telas/tecnologias.
     Responda: artista e comprador de art? no mundo inteiro? a comunicação? para evitar problemas na entrega da commision?
     EXEMPLO: Em aulas práticas, alunos esperam muito para serem atendidos.
     Há filas confusas e frustração. O professor não vê ordem nem tempo de espera.
     Objetivo inicial: organizar a fila para reduzir a espera e garantir justiça. -->
[comprador], em [internet], tem dificuldade em [falar].
Isso causa [a entrega da art de um jeito que ele não queria].
No início, o foco será [artistas] com o objetivo de [menos dor de cabeça].

## 2) Atores e Decisores (quem usa / quem decide)
<!-- Liste papéis
artista
comprador
 (não nomes).
     EXEMPLO:
     Usuários principais: Alunos da turma de Desenvolvimento Web
     Decisores/Apoiadores: Professores da disciplina; Coordenação do curso -->
Usuários principais: [compradores]
Decisores/Apoiadores: [artistas]

## 3) Casos de uso (de forma simples)
<!-- Formato "Ator: ações que pode fazer".
     DICA: Use "Manter (inserir, mostrar, editar, remover)" quando for CRUD.
     EXEMPLO:
     Todos: Logar/deslogar do sistema; Manter dados cadastrais
     Professor: Manter (inserir, mostrar, editar, remover) todos os chamados
     Aluno: Manter (inserir, mostrar, editar, remover) seus chamados 
     
     todos: logar/deslogar do sistema; manter dados cadastrais, escolher como quer logar
     artista: poder publicar arts(como se fosse um portifolio), e pode deixar escrito suas preferencias em qualidades/descrição
     comprador: pode ver um catalago inteiro de desenho(estilo pinterest) e pode olhar apenas artista especificos(fico meio confuso mas imagina um tinder, mas apenas aparece o perfil do artista e varias arts dele embaixo, se gostar pode entrar em contato para pedir uma art se não so sai), ele pode pedir (ai ele pode especificar entre varias opções que o artista pode modificar) ele pode mandar menssagens diretas como obs dos pedidos, ele pode efetuar pagamentos logo apos fechar o negocio com o artista, se ele n der oque você pediu no prazo combinado você recebe seu dinheiro devolta (o que "você pediu" não é você que define, é mais ver se bate com oque foi escolhido na criação do pedido, agora se bater mas o resultado não foi o esperado, ai senta e chora)
     -->
Todos: [Logar/deslogar; Manter dados cadastrais; escolher fundamento da conta;]  
[compradores]: [analizar catalogo geral; analizar perfil por perfil; comprar; fazer o pedido; acesso a ui do artista; adiciona dercrição no pedido; reclamar de coisas faltando; contatar suporte]  
[artista]: [pode postar arts, pode acessar o chat caso receba um pedido ou queira rever pedidos antigos; pode modificar a ui para deixar apenas com oque ele consegue fazer ou prefere fazer; ele pode contatar suporte]

## 4) Limites e suposições
<!-- Simples assim:
     - Limites =
     - Suposições =
     - Plano B = c
     EXEMPLO:
     Limites: entrega final até o fim da disciplina (ex.: 2025-11-30); rodar no navegador; sem serviços pagos.
     Suposições: internet no laboratório; navegador atualizado; acesso ao GitHub; 10 min para teste rápido.
     Plano B: sem internet → rodar local e salvar em arquivo/LocalStorage; sem tempo do professor → testar com 3 colegas. -->
Limites: [prazo final], [regras/tecnologias obrigatórias], [restrições]  
Suposições: [internet/navegador/GitHub/tempo de teste]  
Plano B: [se tudo der errado modificamos o projeto para poder ser usavel apenas com as funcionalidades que ele ja possui no momento, então se so deu de fazer metade mof=dificamos o projeto pra ele funcionar apenas com a mentade]

## 5) Hipóteses + validação
<!-- Preencha as duas frases abaixo. Simples e direto.
     EXEMPLO Valor: Se o aluno ver sua posição na fila, sente mais controle e conclui melhor a atividade.
     Validação: teste com 5 alunos; sucesso se ≥4 abrem/fecham chamado sem ajuda.
     EXEMPLO Viabilidade: Com app no navegador (HTML/CSS/JS + armazenamento local),
     criar e listar chamados responde em até 1 segundo na maioria das vezes (ex.: 9 de cada 10).
     Validação: medir no protótipo com 30 ações; meta: pelo menos 27 de 30 ações (9/10) em 1s ou menos. -->
H-Valor: Se [artista], então [consegue pedidos com menos dor de cabeça] melhora em [dinheiro].  
Validação (valor): [teste rápido/observação]; alvo: [divulgação melhor/menos dor de cabeça].

H-Viabilidade: Com [tecnologia], [ação/tela] leva até [n] s.  
Validação (viabilidade): [medição no protótipo]; meta: [n] s ou menos na maioria das vezes (ex.: 9/10).

## 6) Fluxo principal e primeira fatia
<!-- Pense “Entrada → Processo → Saída”.
     EXEMPLO de Fluxo:
     1) Aluno faz login
     2) Clica em "Pedir ajuda" e descreve a dúvida
     3) Sistema salva e coloca na fila
     4) Lista mostra ordem e tempo desde criação
     5) Professor encerra o chamado
     EXEMPLO de 1ª fatia:
     Inclui login simples, criar chamado, listar em ordem.
     Critérios de aceite (objetivos): criar → aparece na lista com horário; encerrar → some ou marca "fechado". -->
**Fluxo principal (curto):**  
1) [entrada do usuário] → 2) [processo] → 3) [salvar algo] → 4) [mostrar resultado]

**Primeira fatia vertical (escopo mínimo):**  
Inclui: [uma tela], [uma ação principal], [salvar], [mostrar algo]  
Critérios de aceite:
- [Condição 1 bem objetiva]
- [Condição 2 bem objetiva]

## 7) Esboços de algumas telas (wireframes)
<!-- Vale desenho no papel (foto), Figma, Excalidraw, etc. Não precisa ser bonito, precisa ser claro.
     EXEMPLO de telas:
     • Login
     • Lista de chamados (ordem + tempo desde criação)
     • Novo chamado (formulário simples)
     • Painel do professor (atender/encerrar)
     EXEMPLO de imagem:
     ![Wireframe - Lista de chamados](img/wf-lista-chamados.png) -->
[Links ou imagens dos seus rascunhos de telas aqui]

## 8) Tecnologias
<!-- Liste apenas o que você REALMENTE pretende usar agora. -->

### 8.1 Navegador
**Navegador:** [HTML/CSS/JS | React/Vue/Bootstrap/etc., se houver]  
**Armazenamento local (se usar):** [LocalStorage/IndexedDB/—]  
**Hospedagem:** [GitHub Pages/—]

### 8.2 Front-end (servidor de aplicação, se existir)
**Front-end (servidor):** [ex.: Next.js/React/—]  
**Hospedagem:** [ex.: Vercel/—]

### 8.3 Back-end (API/servidor, se existir)
**Back-end (API):** [ex.: FastAPI/Express/PHP/Laravel/Spring/—]  
**Banco de dados:** [ex.: SQLite/Postgres/MySQL/MongoDB/—]  
**Deploy do back-end:** [ex.: Render/Railway/—]

## 9) Plano de Dados (Dia 0) — somente itens 1–3
<!-- Defina só o essencial para criar o banco depois. -->

### 9.1 Entidades
<!-- EXEMPLO:
     - Usuario — pessoa que usa o sistema (aluno/professor)
     - Chamado — pedido de ajuda criado por um usuário -->
- [Entidade 1] — [o que representa em 1 linha]
- [Entidade 2] — [...]
- [Entidade 3] — [...]

### 9.2 Campos por entidade
<!-- Use tipos simples: uuid, texto, número, data/hora, booleano, char. -->

### Usuarios
| Campo           | Tipo                          | Obrigatório | Exemplo            |
|-----------------|-------------------------------|-------------|--------------------|
| id              | número                        | sim         | 1                  |
| nome            | texto                         | sim         | "Ana Souza"        |
| email           | texto                         | sim (único) | "ana@exemplo.com"  |
| senha_hash      | texto                         | sim         | "$2a$10$..."       |
| papel           | número (0=aluno, 1=professor) | sim         | 0                  |
| dataCriacao     | data/hora                     | sim         | 2025-08-20 14:30   |
| dataAtualizacao | data/hora                     | sim         | 2025-08-20 15:10   |

### Artes
| Campo           | Tipo               | Obrigatório | Exemplo                 |
|-----------------|--------------------|-------------|-------------------------|
| id              | número             | sim         | 2                       |
| Usuarios_id     | número (fk)        | sim         | 8f3a-...                |
| urlimage        | texto              | sim         | img/desenhos/desenho    |
| descrição       | texto              | não         | "inserirmuitotexto"     |
| dataCriacao     | data/hora          | não         | 2025-08-20              |
| dataAtualizacao | data/hora          | sim         | 2025-08-20 14:35        |
| palavras chave  | textp  ?           | sim         | "pixelart"              |
| nome            | texto  ?           | sim         | artpeak123              |



### 9.3 Relações entre entidades
<!-- Frases simples bastam. EXEMPLO:
     Um Usuario tem muitos Chamados (1→N).
     Um Chamado pertence a um Usuario (N→1). -->
- Um [A] tem muitos [B]. (1→N)
- Um [B] pertence a um [A]. (N→1)

### 9.4 Modelagem do banco de dados no POSTGRES

```sql

DROP TABLE IF EXISTS Artes;
DROP TABLE IF EXISTS Usuarios;

CREATE TABLE Usuarios (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    senha_hash VARCHAR(255) NOT NULL,
    papel SMALLINT NOT NULL CHECK (papel IN (0, 1)),
    dataCriacao TIMESTAMP NOT NULL DEFAULT NOW(),
    dataAtualizacao TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE Artes (
    id SERIAL PRIMARY KEY,
    Usuarios_id INTEGER NOT NULL REFERENCES Usuarios(id),
    urlImagem VARCHAR(255) NOT NULL,
    nome VARCHAR(255) NOT NULL,
    descricao TEXT,
    palavrasChave TEXT,
    dataCriacao TIMESTAMP NOT NULL DEFAULT NOW(),
    dataAtualizacao TIMESTAMP NOT NULL DEFAULT NOW()
);

INSERT INTO Usuarios (nome, email, senha_hash, papel, dataCriacao, dataAtualizacao) VALUES
('Ana Silva', 'ana.silva@exemplo.com', '$2a$10$AbcdeFgHiJkLmNoPqRsTuVwXyZ0123456789aBcDeFgH', 0, '2025-09-01 10:00:00', '2025-09-01 10:00:00'),
('Carlos Pereira', 'carlos.p@exemplo.com', '$2a$10$BcDeFgHiJkLmNoPqRsTuVwXyZ0123456789aBcDeFgHi', 0, '2025-09-02 11:30:00', '2025-09-02 11:30:00'),
('Beatriz Costa', 'bia.costa@exemplo.com', '$2a$10$CdEfGhIjKlMnOpQrStUvWxYz0123456789aBcDeFgHij', 1, '2025-09-02 15:00:00', '2025-09-03 09:45:00'),
('Daniel Martins', 'daniel.m@exemplo.com', '$2a$10$DeFgHiJkLmNoPqRsTuVwXyZ0123456789aBcDeFgHijk', 0, '2025-09-03 14:10:00', '2025-09-03 14:10:00'),
('Fernanda Lima', 'fernanda.lima@exemplo.com', '$2a$10$EfGhIjKlMnOpQrStUvWxYz0123456789aBcDeFgHijkl', 1, '2025-09-04 08:00:00', '2025-09-05 11:20:00');

INSERT INTO Artes (Usuarios_id, urlImagem, nome, descricao, palavrasChave, dataCriacao, dataAtualizacao) VALUES
(1, '/usuarios/1/arte_dragao.png', 'Dragão em Chamas', 'Um dragão feito em pixel art com cores vibrantes.', 'Pixel Art; Dragão; Fantasia;', '2025-09-02 18:00:00', '2025-09-02 18:00:00'),
(3, '/usuarios/3/estudo_anatomia.jpg', 'Estudo de Mão', 'Esboço realista de uma mão humana, focado em luz e sombra.', 'Desenho; Realismo; Anatomia; Esboço;', '2025-09-03 11:00:00', '2025-09-04 10:05:00'),
(2, '/usuarios/2/paisagem_noturna.png', 'Céu Estrelado', 'Uma paisagem noturna com montanhas e um céu cheio de estrelas.', 'Paisagem; Noite; Estrelas; Digital;', '2025-09-03 20:45:00', '2025-09-03 20:45:00'),
(1, '/usuarios/1/personagem_mago.png', 'Mago Ancião', 'Design de personagem de um mago para um jogo.', 'Personagem; Mago; Jogo; Pixel Art;', '2025-09-04 14:20:00', '2025-09-04 14:20:00'),
(4, '/usuarios/4/abstrato_01.svg', 'Formas e Cores', 'Composição abstrata utilizando formas geométricas simples.', 'Abstrato; Geométrico; Vetor;', '2025-09-05 09:30:00', '2025-09-05 09:30:00'),
(5, '/usuarios/5/flor_aquarela.jpg', 'Hibisco Vermelho', 'Pintura em aquarela de uma flor de hibisco.', 'Aquarela; Pintura; Floral; Natureza;', '2025-09-05 15:15:00', '2025-09-05 16:30:00');

```
