CREATE TABLE IF NOT EXISTS users (
    user_id int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name varchar(30) NOT NULL,
    email text NOT NULL UNIQUE,
    password text NOT NULL
);

SELECT * FROM users;