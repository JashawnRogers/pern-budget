const pool = require('../config/dbEntry')


module.exports = {
    createBudget: async (req, res) => {
        await pool.connect()

        try {

            if (!req.session.user) {
                return res.status(401).json({ message: 'User not authorized' })
            }

            const { category, limit, userId } = req.body
            if (!category || !limit) {
                return res.status(400).json({ message: 'Category and limit are required fields'})
            }

            await pool.query('BEGIN')

            const existingCategory = await pool.query('SELECT category FROM user_budgets WHERE user_id = $1 AND category = $2')
            if (existingCategory.rowCount > 0) {
                return res.status(400).json({ message: 'Category already exists' })
            }

            await db.query("INSERT INTO budget (user_id, category, amount_limit, created_at) VALUES ($1, $2, $3, NOW())", [userId, category, limit]);

            await client.query('COMMIT')
            return res.status(200).json({ message: 'Budget successfully created', budget: {userId, category, limit} })
        } catch (error) {
            await client.query('ROLLBACK')
            return res.status(500).json({ message: 'Internal server error', error: error.message })
        } finally {
            client.release()
        }


    }
}