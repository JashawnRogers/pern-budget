const pool = require('../config/dbEntry')
const bcrypt = require('bcrypt')
const upload = require('../helpers/upload')
const fs = require('fs')
const path = require('path')
const { error } = require('console')


module.exports = {
    signUp : async (req, res) => {
        try {
            const { name, email, password } = req.body
            const hashedPassword = await bcrypt.hash(password, 10)

            if (!email || !email.includes('@')) {
                return res.status(400).json({ error: 'A valid email is required' })
            }

            if (!password || password.length < 8) {
                return res.status(400).json({ error: 'Password must be at least 8 characters' })
            }

            const query = 'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *'

            const { rows } = await pool.query(query, [name, email, hashedPassword])

            res.status(201).json({message: 'User successfully registered', user: rows[0]})
        } catch (error) {
            console.error('Error signing up',error)

            if (error.code === '23505') {
                return res.status(400).json({ error: 'Email already in use' });
            }

            res.status(500).json({error: 'Internal server error', message: error.message})
        }
    },
    logIn: async (req, res) => {
        try {
            const { email, password } = req.body
            const query = 'SELECT user_id, email, name, password, profile_image FROM users WHERE email = $1'
            const { rows } = await pool.query(query, [email])
            
            if (rows.length === 0) {
                return res.status(404).json({error: 'Email not found'})
            }

            const user = rows[0]

            const isMatch = await bcrypt.compare(password, user.password )
            if (!isMatch) {
                return res.status(401).json({error: 'Incorrect password'})
            }
        
            req.session.user = { 
                id: user.user_id, 
                email: user.email, 
                name: user.name,
                profile_image: user.profile_image || null
            }
        
            res.status(202).json({message: 'User successfully logged in', user: req.session.user})
        } catch (error) {
            console.error(error)
            console.error('Login Error: ', error)
            res.status(500).json({error: 'Internal server error', message: error.message})
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
                    return res.status(500).json({ error: 'Logout failed', message: error.message })
                }
            })

            res.clearCookie('connect.sid')
            res.status(200).json({message: 'User successfully logged out'})
        } catch (error) {
            console.error('Unexpected error during logout:', error)
            res.status(500).json({ error: 'Internal server error', message: error.message })
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
            res.status(500).json({error: 'Internal server error', message: error.message})
        }
    },
    getMonthlyIncome: async (req, res) => {
        try {
            if (!req.session.user) {
                return res.status(401).json({ error: 'User not authorized' })
            }

            const user_id = req.session.user.id
            const query = `
                SELECT monthly_income
                FROM users
                WHERE user_id = $1
            `

            const result =  await pool.query(query, [user_id])
            const monthly_income = result.rows[0]?.monthly_income

            return res.status(200).json({message: 'Succesfully fetched monthly income!', monthly_income: monthly_income})            
        } catch (error) {
            console.error(error)
            return res.status(500).json({error: 'Internal server error:', message: error.message})
        }
    }   
    ,
    updateMonthlyIncome: async (req,res) => {
        try {
            if (!req.session.user) {
                return res.status(401).json({ error: 'User not authorized' })
            }

            const user_id = req.session.user.id
            const monthly_income = parseFloat(req.body.monthly_income)

            if (isNaN(monthly_income)) {
                return res.status(400).json({error: 'Monthly Income must be a number'})
            }

            const query = `
            UPDATE users
            SET monthly_income = $1
            WHERE user_id = $2
            `

            await pool.query(query, [monthly_income, user_id])

            res.status(200).json({message: 'Monthly income successfully updated!', monthly_income: monthly_income})
        } catch (error) {
            console.error(error)
            res.status(500).json({error: 'Internal server error', message: error.message})
        }
    },
    getSession: async (req, res) => {
        try {
            if (req.session?.user) {
                return res.status(200).json({ user: req.session.user });
            } else {
                return res.status(401).json({ error: 'Not authenticated' });
            }
        } catch (error) {
            console.error('Error fetching session:', error);
            res.status(500).json({ error: 'Internal server error', message: error.message });
        }
    },
    uploadProfileImage: async (req, res) => {
        try {
            if (!req.session?.user) {
                return res.status(401).json({ error: 'User not authorized' })
            }

            const user_id = req.session.user.id
            const file = req.file

            console.log('File:', req.file)
            console.log('Body:',req.body)

            if (!file) {
                return res.status(400).json({ error: 'No image uploaded' })
            }

            // Builds public url for image
            const imageUrl = `${req.protocol}://${req.get('host')}/uploads/profile_images/${req.file.filename}`
            console.log(req.file.filename)

            // Get the current profile image to delete it
            const existingQuery = 'SELECT profile_image FROM users WHERE user_id = $1'
            const existingResult = await pool.query(existingQuery, [user_id])
            const existingImage = existingResult.rows[0]?.profile_image

            // Delete old file if it exists
            if (existingImage) {
                const oldImagePath = path.join(__dirname, '..', 'uploads', 'profile_images', path.basename(existingImage))
                fs.unlink(oldImagePath, (error) => {
                    // Using console.warn to prevent app from crashing if operation fails
                    if (error) {
                        console.warn('Failed to delete old image', error.message)
                    }
                })
            }

            // Save new image to db
            const updateQuery = `
                UPDATE users
                SET profile_image = $1
                WHERE user_id = $2
                RETURNING user_id, name, email, profile_image
            `

            const { rows } = await pool.query(updateQuery, [imageUrl, user_id])
            console.log('Returned row from UPDATE:', rows[0]);
            // Update user session
            req.session.user.profile_image = rows[0].profile_image

            return res.status(200).json({
                message: 'Profile image uploaded successfully',
                user: rows[0]
            })
        } catch (error) {
            console.error('Upload failed', error)
            return res.status(500).json({ error: 'Internal server error', message: error.message })
        }
    }, 
    updateEmail: async (req, res) => {
        try {
            if (!req.session.user) {
                return res.status(401).json({ error: 'User not authorized' })
            }

            const user_id = req.session.user.id
            const { email } = req.body

            if (!email || !email.includes('@')) {
                return res.status(400).json({ error: 'A valid email is required' })
            }

            const query = `
                UPDATE users
                SET email = $1
                WHERE user_id = $2
                RETURNING user_id, name, email,
            `
            const { rows } = await pool.query(query, [email, user_id])

            req.session.user.email = rows[0].email

            return res.status(200).json({
                message: 'Email successfully updated',
                user: rows[0]
            })

        } catch (error) {
            if (error.code === '23505') {
                return res.status(400).json({ error: 'Email already in use' });
            }

            return res.status(500).json({ error: 'Internal server error', message: error.message })
        }
    },
    updatePassword: async (req, res) => {
        try {
            if (!req.session.user) {
                return res.status(401).json({ error: 'User not authorized' })
            }

            const user_id = req.session.user.id
            const { password } = req.body
            const hashedPassword = await bcrypt.hash(password, 10)

            if (!password || password.length < 8) {
                return res.status(400).json({ error: 'Password must be at least 8 characters' })
            }

            const query = `
                UPDATE users
                SET password = $1
                WHERE user_id = $2
            `
            await pool.query(query, [hashedPassword, user_id])

            return res.status(200).json({ message: 'Password successfully updated' })
        } catch (error) {
            return res.status(500).json({ error: 'Internal server error', message: error.message })
        }
    },
    updateName: async (req, res) => {
        try {
            if (!req.session.user) {
                return res.status(401).json({ error: 'User not authorized' })
            }

            const user_id = req.session.user.id
            const { name } = req.body

            if (!name) {
                return res.status(400).json({ error: 'Name cannot be empty' })
            }

            const query = `
                UPDATE users
                SET name = $1
                WHERE user_id = $2
                RETURNING user_id, name, email, profile_image
            `

           const { rows } = await pool.query(query, [name, user_id])

           req.session.user.name = rows[0].name

            return res.status(200).json({ 
                message: 'Profile name successfully updated',
                user: rows[0]
            })
        } catch (error) {
            return res.status(500).json({ error: 'Internal server error', message: error.message })
        }
    }
}