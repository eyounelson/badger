# BADGER

Badger is a system that simulates loyalty program on an ecomerce webstore.

## Stack
#### Backend
- Laravel 
- Sqlite

#### Frontend
- React with Javascript
- Tailwind CSS

## Setup
Clone this repository and open in two terminal tabs/windows
#### Backend
- `cd backend` 
- install dependencies with `composer instsll`
- copy the `.env.example` file to `.env` with  `cp .env.example .env`
- Create the database file at `databse/database.sqlite` with `touch databse/database.sqlite`
- Set up the DB with a demo user and data wit `php artisan migrate:fresh --seed`
- Run the development server with `php artisan serve --port=8000`

#### Frontend
- `cd frontend`
- install dependencies with `npm install`
- copy the `.env.example` file to `.env` with  `cp .env.example .env`
- Run the development server with `npm run dev`, this will open the project ina new browser tab
- Login, the default credentials are "test@example.com" and "password" for email and password respectively.
- You may now simulate purchases by clicking on "Create Order" to simulate unlocking achievements 🚀🚀.