# Finn Parse

Finn Parse is a full-stack application designed to parse financial data. It features a React-based frontend, a Node.js backend, and utilizes Supabase for database management.

## Tech Stack

- **Frontend**:
  - React
  - TypeScript
  - Vite
  - Tailwind CSS
  - shadcn/ui
- **Backend**:
  - Node.js
  - TypeScript
- **Database**:
  - Supabase

## Project Structure

The project is organized into three main directories:

- `frontend/`: Contains the React frontend application.
- `backend/`: Contains the Node.js backend application.
- `supabase/`: Contains Supabase database migrations.

## Getting Started

To get the project up and running locally, follow these steps:

### 1. Clone the repository

```bash
git clone <repository-url>
cd finn-parse-main
```



### 3. Set up the Frontend

```bash
cd frontend
npm install
# Create a .env file and add your environment variables
npm run dev
```

### 4. Set up Supabase

1.  Install the Supabase CLI if you haven't already.
2.  Link your local project to your Supabase project:

    ```bash
    supabase link --project-ref <your-project-ref>
    ```

3.  Push the migrations to your Supabase project:

    ```bash
    supabase db push
    ```

## Environment Variables

`frontend` directories contain `.env` files for managing environment-specific variables. Make sure to create and populate these files with the necessary credentials and configuration.
