const pool = require('../config/dbEntry')

module.exports = {
    createTransaction: async (req, res) => {
        const client = await pool.connect()

        try {
            if (!req.session.user) {
                return res.status(401).json({ error: 'User not authorized'})
            }

            const { amount, category ,description, vendor ,created_at } = req.body
            const user_id = req.session.user.id

            console.log('Request body:', req.body)
            if (!amount || !category ) {
                return res.status(400).json({ error: 'Amount and category are required fields' })
            }

            // start pg transaction
            await client.query('BEGIN')

            const existingCategory = await client.query('SELECT category FROM user_budgets WHERE user_id = $1 AND category = $2', [user_id, category])

            if (existingCategory.rowCount === 0) {
                return res.status(404).json({ error: 'Category not found. Please create a new one or add to an existing category' })
            }

            const insertQuery = 'INSERT INTO transactions (user_id, amount, category, description, vendor, created_at) VALUES ($1, $2, $3, $4, $5, COALESCE($6, NOW())) RETURNING *;'
            const { rows } = await client.query(insertQuery, [user_id, amount, category, description || null, vendor || null, created_at || null])

            await client.query('COMMIT')
            res.status(201).json({ message: 'Transaction added successfully', transaction: rows[0] })
        } catch (error) {
            await client.query('ROLLBACK') // 'rollback' changes if error to keep from sending partial data to db
            console.error('Error adding transaction:', error)
            res.status(500).json({ error: 'Internal server error', message: error.message })
        } finally {
            client.release() // release client back to pool
        }
    },
    updateTransaction: async (req, res) => {
        const client = await pool.connect()

        try {
            if (!req.session.user) {
                return res.status(401).json({ error: 'User not authorized' })
            }

            const user_id = req.session.user.id

            const { amount, category, description, vendor, id } = req.body

            if (amount === undefined && category === undefined && description === undefined && vendor === undefined) {
                return res.status(400).json({ error: 'No valid fields provided for update' })
            }

            // COALESCE updates only the fields that are provided. If the field is not provided, the original value continues to persist in db
            const updateQuery = `
            UPDATE transactions 
            SET 
                amount = COALESCE($1, amount),  
                category = COALESCE($2, category), 
                description = COALESCE($3, description), 
                vendor = COALESCE($4, vendor)
            WHERE id = $5 AND user_id = $6 
            RETURNING *, user_id;
            `
            // If value is undefined, null is used and COALESCE will keep the existing value
            const queryValues = [
                amount || null,
                category || null,
                description || null,
                vendor || null,
                id,
                user_id
            ]


            await client.query('BEGIN')

            const transactionCheck = await client.query(
                'SELECT * FROM transactions WHERE id = $1 AND user_id = $2',
                [id, user_id]
            )

            if (transactionCheck.rowCount === 0) {
                await client.query('ROLLBACK')
                return res.status(404).json({ error: 'Transaction not found or user unauthorized' })
            }

            const { rows } = await client.query(updateQuery, queryValues)
            await client.query('COMMIT')

            if (rows.length === 0) {
                return res.status(404).json({ error: 'Transaction not found or user not authorized' })
            }

            res.status(200).json({ message: 'Transaction successfully updated', transaction: rows[0] })
        } catch (error) {
            await client.query('ROLLBACK')
            console.error(error)
            return res.status(500).json({ error: 'Internal server error', message: error.message })
        } finally {
            client.release()
        }
    },
    deleteTransaction: async (req, res) => {
        try {
            if (!req.session.user) {
                return res.status(401).json({ error: 'User not authorized' })
            }

            const user_id = req.session.user.id
            const transaction_id = req.params.id 

            const query = 'DELETE FROM transactions WHERE id = $1 AND user_id = $2'
            const { rowCount, rows } = await pool.query(query, [transaction_id, user_id]) // rowCount indicates how many rows were affected

            if (rowCount === 0) {
                return res.status(404).json({ error: 'Transaction not found' })
            }

            return res.status(200).json({ message: 'Transaction successfully deleted', transaction: rows[0] })
        } catch (error) {
            console.error(error)
            return res.status(500).json({ error: 'Internal server error', message: error.message })
        }
    },
    getTransactions: async (req, res) => {
        try {
            if (!req.session.user) {
                return res.status(401).json({ message: 'User not authorized' })
            }

            const user_id = req.session.user.id
            let { page, limit } = req.query
            
            page = parseInt(page) || 1;
            limit = parseInt(limit) || 10;
            const offset = (page - 1) * limit;

            const getTransactionsQuery = `
                SELECT * FROM transactions 
                WHERE user_id = $1
                ORDER BY created_at DESC
                LIMIT $2 OFFSET $3;
            `
            const { rows: transactions } = await pool.query(getTransactionsQuery, [user_id, limit, offset])
            // Total transaction count
            const countQuery = 'SELECT COUNT(*) FROM transactions WHERE user_id = $1;' 
            const { rows } = await pool.query(countQuery, [user_id])
            const totalTransactions = parseInt(rows[0].count)

            return res.status(200).json({
                transactions,
                pagination: {
                    total: totalTransactions,
                    page,
                    limit,
                    totalPages: Math.ceil(totalTransactions / limit),
                    hasNextPage: page * limit < totalTransactions,
                    hasPrevPage: page > 1
                }
            })
        } catch (error) {
            console.error('Error fetching transactions', error)
            return res.status(500).json({ error: 'Internal server error', message: error.message })
        }
    }
}