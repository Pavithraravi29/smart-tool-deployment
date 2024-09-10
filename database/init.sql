CREATE TABLE IF NOT EXISTS login (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS graph (
    id SERIAL PRIMARY KEY,
    tension DECIMAL,
    torsion DECIMAL,
    bending_moment_x DECIMAL,
    bending_moment_y DECIMAL,
    time_seconds DECIMAL,
    temperature DECIMAL
);