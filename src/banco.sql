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

