const pool = require('../config/dbEntry')


module.exports = {
    createBudget: async (req, res) => {
        const client = await pool.connect()
        console.log('Incoming body:', req.body)

        try {

            if (!req.session.user) {
                return res.status(401).json({ message: 'User not authorized' })
            }

            let { category, amount_limit } = req.body
            amount_limit = parseFloat(req.body.amount_limit)
            const userId = req.session.user.id
            if (!category || isNaN(amount_limit)) {
                return res.status(400).json({ message: 'Category and valid numeric limit are required fields'})
            }

            console.log('User ID:', userId)
            console.log('Category:', category)
            console.log('Amount Limit (parsed):', amount_limit)
            await client.query('BEGIN')

            const existingCategory = await pool.query('SELECT category FROM user_budgets WHERE user_id = $1 AND category = $2', [userId, category])
            if (existingCategory.rowCount > 0) {
                await client.query('ROLLBACK')
                return res.status(400).json({ message: 'Category already exists' })
            }
            console.log('Attempting insert into budget table...')
            const insertResult = await client.query('INSERT INTO user_budgets (user_id, category, amount_limit, created_at) VALUES ($1, $2, $3, NOW()) RETURNING *', [userId, category, amount_limit]);

            await client.query('COMMIT')
            console.log('Insert Result:',insertResult.rows[0])
            return res.status(200).json({ message: 'Budget successfully created', 'result':insertResult.rows[0] })
        } catch (error) {
            await client.query('ROLLBACK')
            return res.status(500).json({ message: 'Internal server error', error: error.message })
        } finally {
            client.release()
        }
    },
    updateBudget: async (req, res) => {
        const client = await pool.connect()

        try {
            if (!req.session.user) {
                return res.status(401).json({ message: 'User not authorized' })
            }

            const { category, amount_limit, budgetId } = req.body
            const userId = req.session.user.id

            if (category === undefined && limit === undefined) {
                res.status(400).json({ message: 'No value changed. To make a change, value must differ from what was previously saved' })
            }

            await client.query('BEGIN')

            const budgetCheck = await client.query(
                'SELECT * FROM user_budgets WHERE budget_id = $1 AND user_id = $2', 
                [budgetId, userId]
            )

            if (budgetCheck.rowCount === 0) {
                await client.query('ROLLBACK');
                return res.status(404).json({ message: 'Budget not found or unauthorized' })
            }

            const updateQuery = `
            UPDATE user_budgets 
            SET category = COALESCE($1, category), 
                amount_limit = COALESCE($2, amount_limit) 
            WHERE budget_id = $3 AND user_id = $4 
            RETURNING *;
            `
            const queryValues = [category || null, amount_limit || null, budgetId, userId]

            const result = await client.query(updateQuery, queryValues)
            await client.query('COMMIT')

            return res.status(200).json({ message: 'Successfully updated budget', budget: result.rows[0]})
        } catch (error) {
            await client.query('ROLLBACK')
            return res.status(500).json({ message: 'Internal server error', error: error.message })
        } finally {
            client.release()
        }
    },
    deleteBudget: async (req, res) => {
        const client = await pool.connect()

        try {
            if (!req.session.user) {
                return res.status(401).json({ message: 'User not authorized' })
            }

            const user_id = req.session.user.id
            const budget_id = parseInt(req.params.id, 10)
            
            if (isNaN(budget_id)) {
                return res.status(404).json({ message: 'Invalid budget ID' })
            }

            client.query('BEGIN')

            // Check if the budget exists before attempting to delete
            const checkQuery = 'SELECT * FROM user_budgets WHERE user_id = $1 AND budget_id = $2'
            const checkResult = await client.query(checkQuery, [user_id, budget_id])

            if (checkResult.rowCount === 0) {
                await client.query('ROLLBACK')
                return res.status(404).json({ message: 'Budget not found' })
            }

            const deleteQuery = 'DELETE FROM user_budgets WHERE user_id = $1 AND budget_id = $2'
            const { rowCount, rows } = await pool.query(deleteQuery, [user_id, budget_id]) // rowCount indicates how many rows were affected

            await client.query('COMMIT')

            if (rowCount === 0) {
                return res.status(404).json({ message: 'Budget not found' })
            }

            return res.status(200).json({ message: 'Budget successfully deleted', budget: rows[0] })
        } catch (error) {
            await client.query('ROLLBACK')
            console.error(error)
            return res.status(500).json({ message: 'Internal server error', error: error.message })
        } finally {
            client.release()
        }
    },

    getBudget: async (req, res) => {
        const client = await pool.connect()

        try {
            if (!req.session.user) {
                return res.status(404).json({ message: 'User not authorized' })
            }

            const userId = req.session.user.id
            const { category } = req.params

            await client.query('BEGIN')

            // Get budget limit
            const budgetQuery = 'SELECT amount_limit FROM user_budgets WHERE user_id = $1 AND category = $2;'
            const budgetResult = await client.query(budgetQuery, [userId, category])

            if (budgetResult.rowCount === 0) {
                await client.query('ROLLBACK');
                return res.status(404).json({ message: 'Budget not found' })
            }
            const amount_limit = budgetResult.rows[0].amount_limit

            // Calculate total spending for the budget category
            const totalSpentQuery = 'SELECT COALESCE(SUM(amount), 0) AS total_spent FROM transactions WHERE user_id = $1 AND category = $2;'
            const totalSpentResult = await client.query(totalSpentQuery, [userId, category])
            const totalSpent = totalSpentResult.rows[0].total_spent

            await client.query('COMMIT')

           return res.status(200).json({ category, amount_limit, total_spent: totalSpent })

        } catch (error) {
            await client.query('ROLLBACK')
            console.error(error)
            return res.status(500).json({ message: 'Internal server error', error: error.message })
        } finally {
            client.release()
        }
    },
    getAllBudgets: async (req, res) => {
        const client = await pool.connect()

        try {
            if (!req.session.user) {
                return res.status(401).json({message: 'User not authorized'})
            }

            const userId = req.session.user.id

            await client.query('BEGIN')

            const query = 'SELECT budget_id, category, amount_limit, created_at FROM user_budgets WHERE user_id = $1 ORDER BY created_at DESC'
            const result = await client.query(query, [userId])

            await client.query('COMMIT')
            return res.status(200).json({ budgets: result.rows})
        } catch (error) {
            await client.query('ROLLBACK')
            console.error(error)
            return res.status(500).json({ message: 'Internal server error', error: error.message})
        } finally {
            client.release()
        }
    }
}