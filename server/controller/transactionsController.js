const pool = require('../config/dbEntry')

module.exports = {
    createTransaction: async (req, res) => {
        const client = await pool.connect()

        try {
            if (!req.session.user) {
                return res.status(401).json({ message: 'User not authorized'})
            }

            const { amount, type, category ,description, vendor } = req.body
            const userId = req.session.user.id

            if (!amount || !type || !category ) {
                return res.status(400).json({ message: 'Amount, category and type are required fields' })
            }

            // start pg transaction
            await client.query('BEGIN')

            const insertQuery = 'INSERT INTO transactions (user_id, amount, type, category, description, vendor) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;'
            const { rows } = await client.query(insertQuery, [userId, amount, type, category, description || null, vendor || null])

            await client.query('COMMIT')
            res.status(201).json({ message: 'Transaction added successfully', transaction: rows[0] })
        } catch (error) {
            await client.query('ROLLBACK') // 'rollback' changes if error to keep from sending partial data to db
            console.error('Error adding transaction:', error)
            res.status(500).json({ message: 'Internal server error', error: error.message })
        } finally {
            client.release() // release client back to pool
        }
    },
    updateTransaction: async (req, res) => {
        const client = await pool.connect()

        try {
            if (!req.session.user) {
                return res.status(401).json({ message: 'User not authorized' })
            }

            const userId = req.session.user.id
            const transactionId = req.params.id

            const { amount, type, category, description, vendor } = req.body

            if (amount === undefined && type === undefined && category === undefined && description === undefined && vendor === undefined) {
                return res.status(400).json({ error: 'No valid fields provided for update' })
            }

            // COALESCE updates only the fields that are provided. If the field is not provided, the original value continues to persist in db
            const updateQuery = `
            UPDATE transactions 
            SET 
                amount = COALESCE($1, amount), 
                type = COALESCE($2, type), 
                category = COALESCE($3, category), 
                description = COALESCE($4, description), 
                vendor = COALESCE($5, vendor)
            WHERE id = $6 AND user_id = $7 
            RETURNING *, user_id;
            `
            // If amount is undefined, null is used and COALESCE will keep the existing value
            const queryValues = [
                amount || null,
                type || null,
                category || null,
                description || null,
                vendor || null,
                transactionId,
                userId
            ]


            await client.query('BEGIN')
            const { rows } = await client.query(updateQuery, queryValues)
            await client.query('COMMIT')

            if (rows.length === 0) {
                return res.status(404).json({ message: 'Transaction not found or user not authorized' })
            }

            res.status(200).json({ message: 'Transaction successfully updated', transaction: rows[0] })
        } catch (error) {
            await client.query('ROLLBACK')
            console.error(error)
            return res.status(500).json({ message: 'Internal server error', error: error.message })
        } finally {
            client.release()
        }
    },
    deleteTransaction: async (req, res) => {
        try {
            if (!req.session.user) {
                return res.status(401).json({ message: 'User not authorized' })
            }

            const userId = req.session.user.id
            const transactionId = req.params.id 

            const query = 'DELETE FROM transactions WHERE id = $1 AND user_id = $2'
            const { rowCount } = await pool.query(query, [transactionId, userId]) // rowCount indicates how many rows were affected

            if (rowCount === 0) {
                return res.status(404).json({ message: 'Transaction not found' })
            }

            return res.status(200).json({ message: 'Transaction successfully deleted' })
        } catch (error) {
            console.error(error)
            return res.status(500).json({ message: 'Internal server error', error: error.message })
        }
    }
}