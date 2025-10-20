# Mobinhost ERP Frontend

A red & white themed ERP dashboard for Mobinhost built with React, Vite, and Axios. The application provides authentication plus management screens for employees, departments, positions, and role-based permissions. It is designed to integrate with the provided Mobinhost REST API endpoints.

## Features

- **Authentication** – Login and logout using the provided token-based API.
- **Dashboard** – Overview cards highlighting employee stats and recent hires.
- **Employee directory** – Filterable table with CRUD flows and profile completion insights.
- **Departments & Positions** – CRUD management with modal forms.
- **Roles & permissions** – Create roles, assign granular permissions, and attach roles to employees.
- **Responsive layout** – Sidebar navigation with red & white Mobinhost styling.

## Getting started

1. Install dependencies (requires Node.js 18+):

   ```bash
   npm install
   ```

2. Copy `.env.example` to `.env` (create if missing) and set the API base URL:

   ```bash
   VITE_API_BASE_URL=https://your-api-host
   ```

3. Run the development server:

   ```bash
   npm run dev
   ```

   The app will be available at http://localhost:5173.

4. Build for production:

   ```bash
   npm run build
   ```

## Environment variables

| Variable             | Description                                          |
| -------------------- | ---------------------------------------------------- |
| `VITE_API_BASE_URL`  | Base URL for the Mobinhost ERP backend REST API.     |

## Project structure

```
src/
  api/            Axios clients for each resource
  components/     Reusable UI primitives (cards, tables, forms, modals)
  context/        Auth provider with token persistence
  hooks/          Shared hooks (e.g., useAuth)
  pages/          Route-based screens
  routes/         Route guards for protected pages
  styles/         Global theme and layout styles
```

## Notes

- API responses are expected to follow the structures provided in the brief. Error messages are surfaced inline.
- Location data for employees uses placeholder values until an endpoint is provided.
- Role permissions leverage a curated list of common capabilities; adjust to match backend expectations.
