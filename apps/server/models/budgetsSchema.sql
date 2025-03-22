CREATE TABLE user_budgets (
    budget_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
    category VARCHAR(255) NOT NULL,
    amount_limit DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE (user_id, category) -- Prevent duplicate budget categories for a user
);