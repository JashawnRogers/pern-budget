const pool = require('../config/dbEntry')
const bcrypt = require('bcrypt')


module.exports = {
    signUp : async (req, res) => {
        try {
            console.log('BODY:', req.body)
            const { name, email, password } = req.body
            const hashedPassword = await bcrypt.hash(password, 10)
            const query = 'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *'
            const { rows } = await pool.query(query, [name, email, hashedPassword])

            res.status(201).json({message: 'User successfully registered', user: rows[0]})
        } catch (error) {
            console.error('Error signing up',error)

            if (error.code === '23505') {
                return res.status(400).json({ error: 'Email already in use' });
            }

            res.status(500).json({message: 'Internal server error', error: error.message})
        }
    },
    logIn: async (req, res) => {
        try {
            console.log('BODY:', req.body)
            const { email, password } = req.body
            const query = 'SELECT user_id, email, name, password FROM users WHERE email = $1'
            const { rows } = await pool.query(query, [email])
            
            if (rows.length === 0) {
                return res.status(404).json({error: 'Email not found'})
            }

            const user = rows[0]

            const isMatch = await bcrypt.compare(password, user.password )
            if (!isMatch) {
                return res.status(401).json({error: 'Incorrect password'})
            }
        
            req.session.user = { id: user.user_id, email: user.email, name: user.name }
            console.log(req.session.user)
            res.status(202).json({message: 'User successfully logged in', user: req.session.user})
        } catch (error) {
            console.error(error)
            res.status(500).json({message: 'Internal server error', error: error.message})
        }
    },
    logout: async (req, res) => {
        try {
            console.log('BODY:', req.body)
            if (!req.session.user) {
                return res.status(401).json({error: 'No user logged in'})
            }

            req.session.destroy((error) => {
                if (error) {
                    return res.status(500).json({ message: 'Logout failed', error: error.message })
                }
            })

            res.clearCookie('connect.sid')
            res.status(200).json({message: 'User successfully logged out'})
        } catch (error) {
            console.error('Unexpected error during logout:', error)
            res.status(500).json({ message: 'Internal server error', error: error.message })
        }
    },
    deleteUser: async (req, res) => {
        try {
            console.log('BODY:', req.body)
            const userId = parseInt(req.params.id, 10)
            const query = 'DELETE FROM users WHERE user_id = $1 RETURNING *'
            const { rows } = await pool.query(query, [userId])

            if (rows.length === 0) {
                return res.status(404).json({error: 'User not found'})
            }

            res.status(200).json({message: 'User successfully deleted', user: rows[0]})
        } catch (error) {
            console.error(error)
            res.status(500).json({message: 'Internal server error', error: error.message})
        }
    },
    getSession: async (req, res) => {
        try {
            if (req.session?.user) {
                return res.status(200).json({ user: req.session.user });
            } else {
                return res.status(401).json({ message: 'Not authenticated' });
            }
        } catch (error) {
            console.error('Error fetching session:', error);
            res.status(500).json({ message: 'Internal server error', error: error.message });
        }
    }
}