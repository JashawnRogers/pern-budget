const pool = require('../config/dbEntry')
const { readFile } = require('fs/promises')

const runMigration = async () => {
    try {
        const sql = await readFile('./migrations/004_update_savings_id_column.sql', 'utf-8')
        await pool.query(sql)
        console.log('Migration ran successfully!')
    } catch (error) {
        console.error('Migration failed:', error)
    } finally {
        await pool.end()
    }
}

runMigration()