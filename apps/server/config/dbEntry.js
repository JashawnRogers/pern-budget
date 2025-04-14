const {Pool, types} = require('pg')
require('dotenv').config()

//Parse NUMERIC as float instead of string
types.setTypeParser(types.builtins.NUMERIC, (value) => parseFloat(value))
const pool = new Pool({
    user: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    host: process.env.PG_HOST,
    port: process.env.PG_PORT || 5432,
    database: process.env.PG_DATABASE
})


module.exports = pool