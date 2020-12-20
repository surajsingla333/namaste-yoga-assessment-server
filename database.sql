CREATE DATABASE yogaAssessment;

CREATE TABLE users(
  user_id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
);

CREATE TABLE book_yoga(
    user_id INT,
    booking_date date NOT NULL,
    booking_time_slot VARCHAR(255) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
)