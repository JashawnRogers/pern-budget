const pool = require('../config/dbEntry')

module.exports = {
    createSavingsGoal: async (req, res) => {
        const client = await pool.connect()

        try {
            if (!req.session.user) {
                return res.status(401).json({ message: 'User not authorized' })
            }

            let { title, target_amount } = req.body
            target_amount = parseFloat(req.body.target_amount)
            const user_id = req.session.user.user_id

            if (!title || !target_amount) {
                return res.status(400).json({ message: 'Title and target amount are required fields' })
            }

            await client.query('BEGIN')

            const existingGoal = await pool.query('SELECT title FROM savings WHERE user_id = $1 AND target_amount = $2', [user_id, target_amount])
            if (existingGoal.rowCount > 0) {
                await client.query('ROLLBACK')
                return res.status(400).json({ message: 'Savings goal already exists'})
            }

            const insertResult = await client.query('INSERT INTO savings (user_id, title, target_amount, created_at, updated_at) VALUES ($1, $2, $3, NOW(), NOW()) RETURNING *', [user_id, title, target_amount])

            await client.query('COMMIT')

            return res.status(200).json({ message: 'Savings goal successfully created', 'result': insertResult.rows[0] })
        } catch (error) {
            await client.query('ROLLBACK')
            return res.status(500).json({ message: 'Internal server error', error: error.message })
        } finally {
            client.release()
        }
    },
    updateSavingsGoal: async (req, res) => {
        const client = pool.connect()

        try {
            if (!req.session.user) {
                return res.status(401).json({ message: 'User not authorized' })
            }

            const { title, target_amount, savings_id, add_to_current_amount } = req.body
            const user_id = req.session.user.id

            if (title === undefined && target_amount === undefined) {
                return res.status(400).json({ message: 'No value changed. To make a change, value must differ from what was previously saved' })
            }

            await client.query('BEGIN')

            const existingGoal = await client.query(
                'SELECT * FROM savings WHERE savings_id = $1 AND user_id = $2',
                [savings_id, user_id]
            )
    
            if (existingGoal.rowCount === 0) {
                await client.query('ROLLBACK')
                return res.status(404).json({ message: 'Savings goal not found or unauthorized' })
            }
            
            //  Avoids overwriting the value with NaN or causing incorrect math if the frontend sends an empty string
            const existing = existingGoal.rows[0]
            const delta = parseFloat(add_to_current_amount)
            const newCurrentAmount = !isNaN(delta)
                ? parseFloat(existing.current_amount) + delta
                : existing.current_amount
    
            const updateQuery = `
                UPDATE savings
                SET title = COALESCE($1, title),
                    target_amount = COALESCE($2, target_amount),
                    current_amount = $3,
                    updated_at = NOW()
                WHERE savings_id = $4 AND user_id = $5
                RETURNING *;
            `
    
            const queryValues = [
                title || null,
                target_amount || null,
                newCurrentAmount,
                savings_id,
                user_id
            ]
    
            const result = await client.query(updateQuery, queryValues)
            await client.query('COMMIT')

            return res.status(200).json({ message: 'Successfully updated savings goal', savings_goal: result.rows[0] })
            
        } catch (error) {
            await client.query('ROLLBACK')
            return res.status(500).json({ message: 'Internal server error', error: error.message })
        } finally {
            client.release()
        }
    },
    deleteSavingsGoal: async (req, res) => {
        const client = await pool.connect()

        try {
            if (!req.session.user) {
                return res.status(401).json({ message: 'User not authorized' })
            }

            const user_id = req.session.user.id
            const savings_id = parseInt(req.params.id, 10)

            if (isNaN(savings_id)) {
                return res.status(404).json({ message: 'Invalid ID of savings goal' })
            }

            client.query('BEGIN')

            // Check if savings goal exists before attempting to delete
            const checkQuery = 'SELECT * FROM savings WHERE user_id = $1 AND savings_id = $2'

            const checkResult = await client.query(checkQuery, [user_id, savings_id])

            if (checkResult.rowCount === 0) {
                await client.query('ROLLBACK')
                return res.status(404).json({ message: 'Savings goal not found' })
            }

            const deleteQuery = 'DELETE FROM savings WHERE user_id = $1 AND savings_id = $2'
            const { rows } = await client.query(deleteQuery, [user_id, savings_id])

            await client.query('COMMIT')

            return res.status(200).json({ message: 'Savings goal successfully deleted', savings_goal: rows[0] })
        } catch (error) {
            await client.query('ROLLBACK')
            return res.status(500).json({ message: 'Internal server error', error: error.message })
        } finally {
            client.release()
        }
    },
    getSavingsGoal: async (req, res) => {
        const client = await pool.connect()

        try {
            if (!req.session.user) {
                return res.status(404).json({ message: 'User not authorized' })
            }

            const user_id = req.session.user.id
            const savings_id = parseInt(req.params.id, 10)

            if(isNaN(savings_id)) {
                return res.status(400).json({ message: 'Invalid savings goal ID' })
            }



            await client.query('BEGIN')

            const result = client.query('SELECT * FROM savings WHERE user_id = $1 AND savings_id = $2',[user_id, savings_id])

            await client.query('COMMIT')
            return res.status(200).json({ savings_goal: result.rows[0] })
        } catch (error) {
            await client.query('ROLLBACK')
            return res.status(500).json({ message: 'Internal server error', error: error.message })
        } finally {
            client.release()
        }
    }, 
    getAllSavingsGoals: async (req, res) => {
        const client = pool.connect()

        try {
            if (!req.session.user) {
                return res.status(401).json({ message: 'User not authorized' })
            }

            const user_id = req.session.user.id

            await client.query('BEGIN')

            const result = await client.query('SELECT * FROM savings WHERE user_id = $1 ORDER BY updated_at DESC', [user_id])

            await client.query('COMMIT')
            return res.status(200).json({ savings_goals: result.rows })
        } catch (error) {
            await client.query('ROLLBACK')
            return res.status(500).json({ message: 'Internal server error', error: error.message})
        } finally {
            await client.release()
        }
    }
}