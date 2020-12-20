const Pool = require("pg").Pool;

let splitDbURL = process.env.DATABASE_URL ? process.env.DATABASE_URL.split('/') : []
let splitDbURLOthers = process.env.DATABASE_URL ? process.env.DATABASE_URL.split('/')[2].split(':') : []
let splitDbURLPass = process.env.DATABASE_URL ? process.env.DATABASE_URL.split('/')[2].split(':')[1].split('@') : []

const pool = process.env.DATABASE_URL ? new Pool({
    user: splitDbURLOthers[0],
    password: splitDbURLPass[0],
    host: splitDbURLPass[1],
    port: splitDbURLOthers[2],
    database: splitDbURL[3]
}) : new Pool({
    user: "postgres",
    password: "1234",
    host: "localhost",
    port: 5432,
    database: "yogaAssessment"
});
;

module.exports = pool;