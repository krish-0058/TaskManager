# Task Manager

A modern task management application built with **React**, **Supabase**, and **Tailwind CSS**. It allows users to manage their tasks, upload images, and stay synchronized with real-time updates.

## Features

- **User Authentication** – Sign up and log in securely using Supabase Auth.
- **Email Verification** – Verify email addresses during registration.
- **Password Recovery** – Reset forgotten passwords through email.
- **Task Management** – Create, view, edit, and delete tasks.
- **Image Uploads** – Upload and preview images associated with tasks using Supabase Storage.
- **Real-time Updates** – Receive task updates without manually refreshing the page.
- **Responsive UI** – Dark-themed interface designed for different screen sizes.

## Tech Stack

| Technology | Purpose |
|---|---|
| React | Frontend development |
| Tailwind CSS | Styling and responsive design |
| Supabase | Backend services and database |
| PostgreSQL | Relational database |
| Supabase Auth | User authentication |
| Supabase Storage | Image storage |
| Lucide React | Icons |

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/task-manager-supabase.git
```

### 2. Navigate to the project directory

```bash
cd task-manager-supabase
```

### 3. Install dependencies

```bash
npm install
```

### 4. Configure environment variables

Create a `.env` file in the project root:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_publishable_key
```

Replace the placeholder values with your Supabase project credentials.

### 5. Start the development server

```bash
npm run dev
```

The application will be available at the local URL provided by Vite.

## Supabase Configuration

To run this project, configure your Supabase project with:

- Authentication enabled.
- A PostgreSQL database with the required `tasks` table.
- A Storage bucket named `task-image`.
- Appropriate Row Level Security policies for database and storage operations.
- Realtime enabled for the tasks table.

## Environment Variables

| Variable | Description |
|---|---|
| `VITE_SUPABASE_URL` | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Supabase publishable key |

**Note:** Never expose your Supabase service-role or secret key in frontend code.
