const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");
const response = require("./utils/responseGenerator");
// let responseGenerator = function (error: boolean, message: string, status: number, token: string, data: any, res: any)

//middleware
app.use(cors());
app.use(express.json()); //req.body

//ROUTES//

//test route should work
app.get('/', (req, res) => { res.send('Hello from Express!')});

// signup users
app.post("/api/user-signup", async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (name.length && email.length && password.length) {
            const newUser = await pool.query(
                "INSERT INTO users (name, email, password) VALUES($1, $2, $3) RETURNING name, email, user_id",
                [name, email, password]
            );
            let resFormatter = response(false, "User registered", 200, "TOKEN", newUser.rows[0], "response")
            res.status(resFormatter.status).json(resFormatter)
        }
        else {
            let resFormatter = response(true, "User not registered", 400, "TOKEN", "Name, email and password cannot be empty", "response")
            res.status(resFormatter.status).json(resFormatter)
        }
    } catch (err) {
        let resFormatter = response(true, "Registeration failed with error", 400, "TOKEN", err.message, "response")
        res.status(resFormatter.status).json(resFormatter)
    }
});

// login users
app.post("/api/user-login", async (req, res) => {
    try {
        const { email, password } = req.body;
        if (email.length && password.length) {
            const newUser = await pool.query(
                "SELECT email, name, user_id FROM users WHERE email = $1 and password = $2",
                [email, password]
            );
            console.log("newUSER", newUser)
            if (newUser.rowCount == 1) {
                let resFormatter = response(false, "User loggedin", 200, "TOKEN", newUser.rows[0], "response")
                res.status(resFormatter.status).json(resFormatter)
            } else {
                let resFormatter = response(true, "User not loggedin", 400, "TOKEN", "No user with these credentials exist", "response")
                res.status(resFormatter.status).json(resFormatter)
            }
        }
        else {
            let resFormatter = response(true, "User not loggein", 400, "TOKEN", "Email or password cannot be empty", "response")
            res.status(resFormatter.status).json(resFormatter)
        }
    } catch (err) {
        let resFormatter = response(true, "Login failed with error", 400, "TOKEN", err.message, "response")
        res.status(resFormatter.status).json(resFormatter)
    }
});


// book-slot
app.post("/api/book-slot", async (req, res) => {
    try {
        const { user_id, booking_date, booking_time_slot } = req.body;
        console.log("req.body", req.body)
        if (user_id && booking_time_slot && booking_date) {
            const newUser = await pool.query(
                "INSERT INTO book_yoga (user_id, booking_date, booking_time_slot) VALUES($1, $2, $3) RETURNING *",
                [user_id, booking_date, booking_time_slot]
            );
            console.log("newUSER", newUser)
            let resFormatter = response(false, "Time slot booked", 200, "TOKEN", newUser.rows[0], "response")
            res.status(resFormatter.status).json(resFormatter)
        }
        else {
            let resFormatter = response(true, "Time slot not booked", 400, "TOKEN", "empty or wrong data passed", "response")
            res.status(resFormatter.status).json(resFormatter)
        }
    } catch (err) {
        let resFormatter = response(true, "Error booking time slot", 400, "TOKEN", err.message, "response")
        res.status(resFormatter.status).json(resFormatter)
    }
});


// get all book-slot
app.get("/api/book-slot", async (req, res) => {
    try {
        console.log("req.body", req.body)
        const newUser = await pool.query(
            "SELECT * FROM book_yoga;",
        );
        console.log("newUSER", newUser)
        if (newUser.rowCount >= 1) {
            let resFormatter = response(false, "All booking fetched", 200, "TOKEN", newUser.rows, "response")
            res.status(resFormatter.status).json(resFormatter)
        } else {
            let resFormatter = response(false, "All booking fetched, no bookings", 200, "TOKEN", "There are no bookings at this moment", "response")
            res.status(resFormatter.status).json(resFormatter)
        }
    } catch (err) {
        let resFormatter = response(true, "Error while fetching the bookings", 400, "TOKEN", err.message, "response")
        res.status(resFormatter.status).json(resFormatter)
    }
});

// get all book-slot of one user
app.get("/api/book-slot/:user_id", async (req, res) => {
    let user_id = req.params.user_id
    if (user_id >= 1) {
        try {
            console.log("req.body", req.body)
            console.log("req.body", req.params.user_id)
            const newUser = await pool.query(
                "SELECT * FROM book_yoga where user_id=$1;",
                [user_id]
            );
            console.log("newUSER", newUser)
            let resFormatter = response(false, "All bookings of the user fetched", 200, "TOKEN", newUser.rows, "response")
            res.status(resFormatter.status).json(resFormatter)
        } catch (err) {
            let resFormatter = response(true, "Error while fetching user's bookings", 400, "TOKEN", err.message, "response")
            res.status(resFormatter.status).json(resFormatter)
        }
    } else {
        let resFormatter = response(true, "No bookings fetched", 400, "TOKEN", "Wrong user id", "response")
        res.status(resFormatter.status).json(resFormatter)
    }
});

// get all bookings details on current date
app.post("/api/book-slot-details", async (req, res) => {
    let date = req.body.date
    console.log("DATE", date, req.body)
    if (date) {
        try {
            console.log("req.body", req.body)
            const newUser = await pool.query(
                "SELECT users.user_id, name, email, booking_time_slot, booking_date FROM book_yoga INNER JOIN users ON book_yoga.user_id = users.user_id where booking_date=$1;",
                [date]
            );
            console.log("newUSER", newUser)
            let resFormatter = response(false, "All bookings of the date fetched", 200, "TOKEN", newUser.rows, "response")
            res.status(resFormatter.status).json(resFormatter)
        } catch (err) {
            let resFormatter = response(true, "Error while fetching the bookings", 400, "TOKEN", err.message, "response")
            res.status(resFormatter.status).json(resFormatter)
        }
    } else {
        let resFormatter = response(true, "No bookings fetched", 400, "TOKEN", "No date", "response")
        res.status(resFormatter.status).json(resFormatter)
    }
});

app.listen(process.env.PORT || 5000, () => {
    console.log("server has started on port 5000");
});
