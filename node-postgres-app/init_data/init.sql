CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE
);

INSERT INTO users (name, email) VALUES ('Alice', 'alice@example.com');
INSERT INTO users (name, email) VALUES ('Bob', 'bob@example.com');
INSERT INTO users (name, email) VALUES ('Charlie', 'charlie@example.com');
INSERT INTO users (name, email) VALUES ('David', 'david@example.com');
INSERT INTO users (name, email) VALUES ('Emma', 'emma@example.com');
-- Add as many mock entries as you like
