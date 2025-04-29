# Echo Backend API

Echo is a Twitter-like social media platform backend API built with Flask and SQLAlchemy.

## Features

- User System
  - Registration/Login
  - Profile Management (including nickname)
  - Follow/Unfollow Users
- Tweet System
  - Post/Delete Tweets
  - Personal/Home Timeline
- Interaction System
  - Like/Unlike
  - Comments
- Search Functionality
- Notification System
- Admin Features

## Tech Stack

- **Flask**: Web Framework
- **SQLAlchemy**: ORM Database Mapping
- **Flask-JWT-Extended**: JWT Authentication
- **Flask-Migrate**: Database Migrations
- **MySQL**: Database

## Project Structure

```
/echo-backend
├── app/                  # Main Application Directory
│   ├── controllers/      # Controller Layer
│   ├── models/           # Data Model Definitions
│   ├── routes/           # Route Definitions
│   ├── services/         # Business Logic Services
│   └── __init__.py       # Application Initialization
├── migrations/           # Database Migration Files
├── app.py                # Application Entry Point
├── config.py             # Configuration File
├── requirements.txt      # Dependencies List
├── API_DOCUMENTATION.md  # API Documentation
├── FRONTEND_API_GUIDE.md # Frontend Integration Guide
└── README.md             # Project Description
```

## Installation and Running

1. Clone the project

```bash
git clone https://github.com/yourusername/echo-backend.git
cd echo-backend
```

2. Create a virtual environment

```bash
python -m venv venv
venv\Scripts\activate  # Windows
source venv/bin/activate  # Linux/Mac
```

3. Install dependencies

```bash
pip install -r requirements.txt
```

4. Configure environment variables

Create a `.env` file and configure:

```
FLASK_APP=app.py
FLASK_ENV=development
SECRET_KEY=your-secret-key
DATABASE_URL=mysql+pymysql://username:password@localhost/echo_db
JWT_SECRET_KEY=your-jwt-secret-key
```

5. Database migration

```bash
flask db init  # If migrations directory doesn't exist
flask db migrate -m "Initial migration"
flask db upgrade
```

6. Create admin user

```bash
python create_admin.py
```

7. Run the application

```bash
flask run
```

## API Documentation

Detailed API documentation can be found in `API_DOCUMENTATION.md`.
OpenAPI specification can be found in `openapi.json`.
Frontend integration guide can be found in `FRONTEND_API_GUIDE.md`.

## User Features

The system now supports user nicknames in addition to usernames:
- Usernames are unique identifiers for authentication
- Nicknames are display names that can be more personalized
- Nicknames default to username if not provided during registration
- Admin accounts can be updated with customized nicknames

## Development Progress

- [x] Project Structure Setup
- [x] Database Model Design
- [x] User Authentication System (with Nickname Support)
- [x] Admin Features
- [ ] Tweet System
- [ ] Like System
- [ ] Comment System
- [ ] Search Functionality
- [ ] Notification System

## Testing

Use Postman or any API testing tool to test the endpoints. Authentication routes:

- POST `/api/auth/register` - User Registration
- POST `/api/auth/login` - User Login
- GET `/api/auth/me` - Get Current User Information
- GET `/api/auth/check-admin` - Check Admin Permissions

## License

MIT 