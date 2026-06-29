CREATE DATABASE IF NOT EXISTS maquiagem;

USE maquiagem;

CREATE TABLE marcas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL
);

CREATE TABLE categorias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL
);

CREATE TABLE produtos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    cor VARCHAR(50),
    preco DECIMAL(10,2) NOT NULL,
    quantidade INT NOT NULL,
    marca VARCHAR(100) NOT NULL,
    categoria_id INT NOT NULL,
    FOREIGN KEY (categoria_id) REFERENCES categorias(id)
);

INSERT INTO marcas (nome)
VALUES
('Fenty Beauty'),
('Rare Beauty'),
('Dior Beauty');

INSERT INTO categorias (nome)
VALUES
('Base'),
('Blush'),
('Gloss'),
('Batom');

INSERT INTO produtos
(nome, cor, preco, quantidade, marca, categoria_id)
VALUES
('Base Líquida Pro Filtr Soft Matte Foundation', '210', 249.90, 12, 1, 1),

('Gloss Labial Gloss Bomb Universal Lip Luminizer', 'Fenty Glow', 159.90, 20, 1, 3),

('Blush Líquido Soft Pinch Liquid Blush', 'Hope', 179.90, 15, 2, 2),

('Gloss Labial Soft Pinch Tinted Lip Oil', 'Honesty', 169.90, 11, 2, 3),

('Batom Dior Addict Lip Glow', '001 Pink', 239.90, 10, 3, 4),

('Base Líquida Forever Skin Glow Foundation', '2N', 329.90, 8, 3, 1);

