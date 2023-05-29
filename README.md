# final-project
Web Programming 2023 - Final Project


## How to run the project

- Clone the code onto your local machine with `git clone git@github.com:TiTe-5G00EV16/2023-final-project-JuhoBjn.git`
- Navigate to the project folder `cd 2023-final-project-JuhoBjn/`
- Before running the docker containers, open docker-compose.yml in the text editor of your choice and replace the placeholder db name and password with your own.
- Start up the database and db management panel containers with `docker-compose up -d`. (You need to have Docker Desktop running)
- Navigate to the `backend` folder. Here, enter `npm install` to install all the necessary packages.
- Next, create a file named `.env` with the following content. Replace all the placeholder values (marked with <>) with your own. Make sure DB_DATABASE and DB_PASSWORD are the same ones you entered into the docker-compose file.
```
DB_HOST=localhost
DB_PORT=3306
DB_DATABASE=<your-db-name>
DB_USERNAME=root
DB_PASSWORD=<your-db-password>
JWT_KEY=<your-choice-of-key>
```
- Once you've created the file, you are ready to run the backend with `npm run start`.
  - Alternatively, you can run a development server with `npm run dev`.
- Open a new terminal tab/window to the root of the project and navigate to the `frontend` folder.
- Here, install all the necessary packages with `npm install`.
- Then create a file called `.env` with `VITE_API_URL=http://localhost:5000` as the only line in it.
- Now you are ready to run the frontend with `npm run dev`.


## Deployment

This project is deployed and available on Render.
- Frontend: https://marketplace-frontend-juhobjn.onrender.com
- Backend: https://marketplace-backend-juhobjn.onrender.com

Backend endpoints:
- `/pulsecheck` GET to check if the backend is live
- `/api/users/signup` POST to sign up a user
- `/api/users/login` POST to login
- `/api/listings` GET to fetch all listings
- `/api/listings/<id>` GET to fetch all listings from user with id
- `/api/listings/<id>` DELETE to delete a listing with id, requires authorization
- `/api/listings/create` POST to create a listing, requires authorization
- `/api/listings/update` PUT to update a listing with new object, requires authorization

## Project summary

For this project I made a general-purpose online marketplace where anyone can make their own sales listings.

Features implemented:
- User authentication
  - Sign up
  - Login
  - Logout
- Listing creation
- Listing editing
- Listing deletion
- Viewing all listings
- Viewing user's own listings

### Backend

The backend I made with Node.js and Express. Data is stored into a MySQL database. Code for the endpoints is divided into three folders, one for routes, another for controllers and one for models for communicating with the database. All routes have validation for the data provided in requests to make sure no bad or incomplete data gets into the database.
Connections to the database are handled with a connection pool to enhance performance.
The backend uses middleware to verify tokens on requests to endpoints that require authentication. CORS is used to permit only requests coming from the project's frontend.

Tests for the endpoints are made using Jest and Supertest. The tests cover all the expected use cases.

Writing the backend was quite trouble-free. Writing asynchronous code in the setup and teardown phases of tests did cause some issues at first with setup and teardown functions being run while tests were executing. The solution was to place the setup and teardown into a promise and return the promise.

### Frontend

I made the frontend using React. The code for the page is divided into pages, components to be used in those pages and utility functions for communicating with the backend. Site navigation is implemented using React Router v6. Layout of the page is about as responsive as I was able to make it and is quite usable even on mobile.

Tests for the fronted are made with Testing-Library and Cypress. Testing-Library for tests that verify all the correct components are rendered. Cypress for testing functionality.

Writing all the JSX and functions to make the site interactive was quite easy and trouble-free. CSS on the other hand caused some headache when things just wouldn't line up the way I wanted them to. With some trial and error, I did finally get things to work.
