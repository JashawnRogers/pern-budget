const {Pool, types} = require('pg')
require('dotenv').config()

//Parse NUMERIC as float instead of string
types.setTypeParser(types.builtins.NUMERIC, (value) => parseFloat(value))
const pool = new Pool({
    host: process.env.PG_HOST,
    port: process.env.PG_PORT,
    database: process.env.PG_DATABASE,
    user: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    ssl: {
        rejectUnauthorized: false // Required for Supabase SSL
    }
})


module.exports = pool