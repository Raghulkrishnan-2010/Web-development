# Registration API

## Setup

1. Install MongoDB locally, or provide a MongoDB Atlas connection string.
2. From this directory, run `npm install`.
3. Copy `.env.example` to `.env` and set `MONGODB_URI`.
4. Start the API with `npm run dev`.

The API listens on `http://localhost:5000` by default.

## Endpoint

`POST /api/registrations` accepts `name`, `email`, `phone`, `dob`, `gender`, `course`, and `address`.

The email field is unique, so duplicate registrations return HTTP 409.
