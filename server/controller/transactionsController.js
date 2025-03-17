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
            const { rows } = await pool.query(insertQuery, [userId, amount, type, category, description || null, vendor || null])

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
}