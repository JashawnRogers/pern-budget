const {Pool, types} = require('pg')
require('dotenv').config()

//Parse NUMERIC as float instead of string
types.setTypeParser(types.builtins.NUMERIC, (value) => parseFloat(value))
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false // Required for Supabase SSL
    }
})


module.exports = pool