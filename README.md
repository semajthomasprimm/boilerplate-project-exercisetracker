# Exercise Tracker
### A REST API that tracks exercise information for users.

* Endpoints are open and require no authentication

### Endpoints documentation

* Create a new user:  `POST /api/users`
* Add exercises:                        `POST /api/users/:_id/exercises`
* Get full excerise log for any user:   `GET /api/users/:_id/logs`
    - Returns a user object with a count property (number of exercises belonging to that user) and an array of all execises added 
* Get a user's exercise log:             `GET /api/users/:_id/logs?[from][&to][&limit]` 
* Get a list of all users:                `GET /api/users`

### Tech Stack
- NodeJS
- Express
- uuid - for generating unique identification numbers
- Mongoose
- MongoDB