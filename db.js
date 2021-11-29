const Pool = require("pg").Pool

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    },
    host: "ec2-50-16-241-192.compute-1.amazonaws.com",
    user:"ocswzcfqixoqbc",
    password:"ae82eca5aa848c2b075ffe9827b04394b6f86e667492294addae8353cc894c52",
    port:5432,
    database:"d1hm1nnk6t70i2"
})

module.exports = pool