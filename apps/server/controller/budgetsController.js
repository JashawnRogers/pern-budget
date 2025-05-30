const pool = require('../config/dbEntry')


module.exports = {
    createBudget: async (req, res) => {
        const client = await pool.connect()

        try {

            if (!req.session.user) {
                return res.status(401).json({ error: 'User not authorized' })
            }

            let { category, amount_limit } = req.body
            amount_limit = parseFloat(req.body.amount_limit)
            const userId = req.session.user.id
            if (!category || isNaN(amount_limit)) {
                return res.status(400).json({ error: 'Category and valid numeric limit are required fields'})
            }

            await client.query('BEGIN')

            const existingCategory = await pool.query('SELECT category FROM user_budgets WHERE user_id = $1 AND category = $2', [userId, category])
            if (existingCategory.rowCount > 0) {
                await client.query('ROLLBACK')
                return res.status(400).json({ message: 'Category already exists' })
            }
    
            const insertResult = await client.query('INSERT INTO user_budgets (user_id, category, amount_limit, created_at) VALUES ($1, $2, $3, NOW()) RETURNING *', [userId, category, amount_limit]);

            await client.query('COMMIT')
            console.log('Insert Result:',insertResult.rows[0])
            return res.status(200).json({ message: 'Budget successfully created', 'result':insertResult.rows[0] })
        } catch (error) {
            await client.query('ROLLBACK')
            return res.status(500).json({ error: 'Internal server error', message: error.message })
        } finally {
            client.release()
        }
    },
    updateBudget: async (req, res) => {
        const client = await pool.connect()

        try {
            if (!req.session.user) {
                return res.status(401).json({ error: 'User not authorized' })
            }

            const { category, amount_limit, budget_id } = req.body
            const userId = req.session.user.id

            if (category === undefined && limit === undefined) {
                res.status(400).json({ error: 'No value changed. To make a change, value must differ from what was previously saved' })
            }

            await client.query('BEGIN')

            const budgetCheck = await client.query(
                'SELECT * FROM user_budgets WHERE budget_id = $1 AND user_id = $2', 
                [budget_id, userId]
            )

            if (budgetCheck.rowCount === 0) {
                await client.query('ROLLBACK');
                return res.status(404).json({ error: 'Budget not found or user unauthorized' })
            }

            const updateQuery = `
            UPDATE user_budgets 
            SET category = COALESCE($1, category), 
                amount_limit = COALESCE($2, amount_limit) 
            WHERE budget_id = $3 AND user_id = $4 
            RETURNING *;
            `
            const queryValues = [category || null, amount_limit || null, budget_id, userId]

            const result = await client.query(updateQuery, queryValues)
            await client.query('COMMIT')
            console.log(result.rows[0])
            return res.status(200).json({ message: 'Successfully updated budget', budget: result.rows[0]})
        } catch (error) {
            await client.query('ROLLBACK')
            return res.status(500).json({ error: 'Internal server error', message: error.message })
        } finally {
            client.release()
        }
    },
    deleteBudget: async (req, res) => {
        const client = await pool.connect()

        try {
            if (!req.session.user) {
                return res.status(401).json({ error: 'User not authorized' })
            }

            const user_id = req.session.user.id
            const budget_id = parseInt(req.params.id, 10)
            
            if (isNaN(budget_id)) {
                return res.status(404).json({ error: 'Invalid budget ID' })
            }

            client.query('BEGIN')

            // Check if the budget exists before attempting to delete
            const checkQuery = 'SELECT * FROM user_budgets WHERE user_id = $1 AND budget_id = $2'
            const checkResult = await client.query(checkQuery, [user_id, budget_id])

            if (checkResult.rowCount === 0) {
                await client.query('ROLLBACK')
                return res.status(404).json({ error: 'Budget not found' })
            }

            const deleteQuery = 'DELETE FROM user_budgets WHERE user_id = $1 AND budget_id = $2'
            const { rowCount, rows } = await pool.query(deleteQuery, [user_id, budget_id]) // rowCount indicates how many rows were affected

            await client.query('COMMIT')

            if (rowCount === 0) {
                return res.status(404).json({ error: 'Budget not found' })
            }

            return res.status(200).json({ message: 'Budget successfully deleted', budget: rows[0] })
        } catch (error) {
            await client.query('ROLLBACK')
            console.error(error)
            return res.status(500).json({ error: 'Internal server error', message: error.message })
        } finally {
            client.release()
        }
    },

    getBudget: async (req, res) => {
        const client = await pool.connect()

        try {
            if (!req.session.user) {
                return res.status(404).json({ error: 'User not authorized' })
            }

            const userId = req.session.user.id
            const { category } = req.params

            await client.query('BEGIN')

            // Get budget limit
            const budgetQuery = 'SELECT amount_limit FROM user_budgets WHERE user_id = $1 AND category = $2;'
            const budgetResult = await client.query(budgetQuery, [userId, category])

            if (budgetResult.rowCount === 0) {
                await client.query('ROLLBACK');
                return res.status(404).json({ error: 'Budget not found' })
            }
            const amount_limit = budgetResult.rows[0].amount_limit

            // Calculate total spending for the budget category
            const totalSpentQuery = 'SELECT COALESCE(SUM(amount), 0) AS total_spent FROM transactions WHERE user_id = $1 AND category = $2;'
            const totalSpentResult = await client.query(totalSpentQuery, [userId, category])
            const total_spent = totalSpentResult.rows[0].total_spent

            await client.query('COMMIT')
            return res.status(200).json({ category, amount_limit, total_spent: total_spent })

        } catch (error) {
            await client.query('ROLLBACK')
            console.error(error)
            return res.status(500).json({ error: 'Internal server error', message: error.message })
        } finally {
            client.release()
        }
    },
    getAllBudgets: async (req, res) => {
        const client = await pool.connect()

        try {
            if (!req.session.user) {
                return res.status(401).json({error: 'User not authorized'})
            }

            const userId = req.session.user.id

            await client.query('BEGIN')

            const query = `
            SELECT budget_id, category, amount_limit, created_at 
            FROM user_budgets 
            WHERE user_id = $1 ORDER BY created_at DESC
            `
            const budgetResult = await client.query(query, [userId])
            const budgets = budgetResult.rows
            
            // Loop through budgets and get total spent per category
            const enrichedBudgets = await Promise.all( budgets.map( async (budget) => {
                const spendQuery = `
                SELECT COALESCE(SUM(amount), 0) AS total_spent
                FROM transactions
                WHERE user_id = $1 AND category = $2
                `
                const spendResult = await client.query(spendQuery, [userId, budget.category])
                const total_spent = spendResult.rows[0].total_spent

                return {
                    ...budget,
                    total_spent: parseFloat(total_spent)
                }
            }))

            await client.query('COMMIT')
            return res.status(200).json({ budgets: enrichedBudgets})
        } catch (error) {
            await client.query('ROLLBACK')
            return res.status(500).json({ error: 'Internal server error', message: error.message})
        } finally {
            client.release()
        }
    }
}