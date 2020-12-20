module.exports = {
    local: {

    },
    development: {
        client: "pg",
        connection: process.env.DATABASE_URL,
        pool: {
            min: 2,
            max: 10
        },
        migrations: {

        }
    },
}