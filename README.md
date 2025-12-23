# Quiz Management Application

A full-stack quiz management application with FastAPI backend and React frontend.

## Features

### Backend (FastAPI)
- **Layered Architecture**: Models → Accessors → Services → Handlers
- **Admin Authentication**: JWT-based OAuth2 authentication
- **Quiz Management**: Create, read, update, delete quizzes
- **Question Types**: MCQ, True/False, Text answers
- **Public API**: Quiz taking and submission without authentication
- **Real-time Scoring**: Calculate scores without storing individual answers

### Frontend (React)
- **Modern UI**: Dark theme with premium design
- **Public Features**: Browse quizzes, take quizzes, view results
- **Admin Dashboard**: Manage quizzes with full CRUD operations
- **Responsive Design**: Works on all devices
- **OAuth2 Integration**: Secure admin authentication

## Project Structure

```
.
├── backend/
│   ├── app/
│   │   ├── core/           # Configuration, database, security
│   │   ├── models/         # SQLAlchemy models
│   │   ├── schemas/        # Pydantic schemas
│   │   ├── accessors/      # Business logic layer
│   │   ├── services/       # Orchestration layer
│   │   ├── handlers/       # API routes
│   │   └── main.py         # FastAPI application
│   ├── requirements.txt
│   └── .env.example
│
└── frontend/
    ├── src/
    │   ├── api/            # API client
    │   ├── components/     # Reusable components
    │   ├── context/        # React context providers
    │   ├── pages/          # Page components
    │   └── index.css       # Global styles
    ├── package.json
    └── .env.example

```

## Setup Instructions

### Backend Setup

1. **Navigate to backend directory**:
   ```bash
   cd backend
   ```

2. **Create virtual environment**:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure environment**:
   ```bash
   cp .env.example .env
   # Edit .env and add your PostgreSQL connection string
   ```

5. **Run the server**:
   ```bash
   uvicorn app.main:app --reload
   ```

   The API will be available at `http://localhost:8000`
   - API Documentation: `http://localhost:8000/docs`
   - Alternative docs: `http://localhost:8000/redoc`

### Frontend Setup

1. **Navigate to frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment**:
   ```bash
   cp .env.example .env
   # Update VITE_API_BASE_URL if needed
   ```

4. **Run development server**:
   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:5173`

## Running the Application

### Running the Backend
From the `backend` directory:
```bash
# Activate virtual environment if not already active
# source venv/bin/activate  # On Windows: venv\Scripts\activate

# Run the server
uvicorn app.main:app --reload
```
The API will run at `http://localhost:8000`.

### Running the Frontend
From the `frontend` directory:
```bash
npm run dev
```
The application will run at `http://localhost:5173`.

## API Endpoints

### Public Endpoints
- `GET /api/public/quizzes` - List active quizzes
- `GET /api/public/quizzes/{id}` - Get quiz questions (no answers)
- `POST /api/public/quizzes/{id}/submit` - Submit quiz answers
- `POST /api/users/register` - Register user email

### Admin Endpoints (Authentication Required)
- `POST /api/auth/admin/register` - Register admin
- `POST /api/auth/admin/login` - Admin login
- `GET /api/auth/admin/me` - Get current admin
- `POST /api/quizzes` - Create quiz
- `GET /api/quizzes` - List admin's quizzes
- `GET /api/quizzes/{id}` - Get quiz with answers
- `PUT /api/quizzes/{id}` - Update quiz
- `DELETE /api/quizzes/{id}` - Delete quiz

## Database Schema

- **admins**: Admin users with authentication
- **users**: Quiz takers (email only)
- **quizzes**: Quiz metadata
- **questions**: Quiz questions with types (MCQ, True/False, Text)
- **answers**: Correct answers and explanations
- **quiz_submissions**: Final scores (no individual answers stored)

## Database Migrations

This project uses Alembic for database migrations.

1.  **Generate a migration** (after changing models):
    ```bash
    cd backend
    alembic revision --autogenerate -m "Description of changes"
    ```

2.  **Apply migrations**:
    ```bash
    cd backend
    alembic upgrade head
    ```

## Usage

### For Quiz Takers
1. Visit the landing page
2. Enter your email address
3. Select a quiz to take
4. Answer all questions
5. Submit and view your results

### For Admins
1. Login at `/admin/login`
2. Create quizzes from the dashboard
3. Add questions with different types
4. Manage quiz status (active/inactive)
5. Delete quizzes as needed

## Technologies Used

### Backend
- FastAPI
- SQLAlchemy
- PostgreSQL
- Pydantic
- JWT (python-jose)
- Bcrypt (passlib)

### Frontend
- React
- React Router
- Axios
- Vite
- CSS Variables

## License

MIT
