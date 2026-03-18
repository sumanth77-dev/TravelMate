# TravelMate Complete Backend Setup Instructions

The Complete Backend mapped to your Frontend Requirements is now generated successfully!

## Prerequisites
- **Node.js**: Ensure Node.js is installed.
- **MySQL**: Have your MySQL Server running.

## Database Setup

1. Open your terminal or your MySQL Workbench.
2. We have provided `schema.sql` inside the `backend/database/` directory.
3. Import or Execute the script `database/schema.sql` in your MySQL Server. This automatically creates the `travel_explorer` database and adds all heavily normalized tables (`users`, `guides`, `guide_expertise`, `bookings`, `reviews` etc) that your frontend forms inherently map to.

## Project Setup

1. Open a terminal.
2. Navigate into your backend directory:
   ```bash
   cd /path/to/TravelMate/backend
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Configure Environment Variables:
   Open the `backend/.env` file and make sure the MySQL credentials match your local dev environment.
   ```env
   DB_HOST=localhost
   DB_USER=root
   DB_PASS=<<YOUR_PASSWORD>>
   DB_NAME=travel_explorer
   ```

## Running the Server

Start the development server using nodemon for automatic reloads on changes.
```bash
npm run dev
```

The application will bind to `http://localhost:5000` assuming port `5000` is free.

## Connecting Frontend with Backend APIs

Change the storage logic on the frontend to HTTP hits via the built-in Native `Fetch API` or `Axios`.

For instance, your Guide Post API form data handling (Multer expects form-data):
```javascript
// Guide Sign Up snippet
const formData = new FormData();
formData.append('full_name', document.getElementById('name').value);
formData.append('email', document.getElementById('email').value);
// ... append text fields
formData.append('role', 'Guide');
formData.append('government_id_upload', document.getElementById('gIdFile').files[0]);
formData.append('profile_photo', document.getElementById('gPhotoFile').files[0]);

fetch('http://localhost:5000/api/auth/register', {
    method: 'POST',
    body: formData // DO NOT manually set Content-Type; browser handles the boundary
})
.then(response => response.json())
.then(data => console.log(data));
```

The API structure currently supports:
- `POST /api/auth/register` (Multipart/form-data for Guide file uploads)
- `POST /api/auth/login`
- `GET /api/guides`
- `GET /api/guides/:id`
- `POST /api/bookings`
- `GET /api/bookings/:userId`
- `POST /api/reviews`
- `GET /api/reviews/:guideId`
