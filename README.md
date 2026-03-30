# LMS(PRISM)

Learning Management System built with a decoupled Laravel API and React SPA frontend.

## Overview

This repository contains two apps:

- `backend/` - Laravel 12 REST API with Sanctum authentication
- `frontend/` - React 19 + Vite single-page application

The platform is centered around course publishing and student learning flows:

- User registration and login
- Course creation and editing
- Chapter and lesson management
- Outcomes and requirements management
- Course discovery and filtering
- Enrolled course and watch progress views

## Tech Stack

### Backend

- PHP 8.2+
- Laravel 12
- MySQL 8
- Laravel Sanctum
- Intervention Image
- `pbmedia/laravel-ffmpeg`

### Frontend

- React 19
- React Router DOM 7
- Vite 8
- Bootstrap 5
- React Hook Form
- `@hello-pangea/dnd`
- FilePond
- Framer Motion

## Architecture

The app follows a separated SPA + API setup:

- React runs independently from Laravel
- Frontend calls the API through `VITE_API_URL`
- Authenticated requests use Sanctum tokens
- Auth state is stored in `localStorage` under `userInfoLms`
- Protected pages are wrapped by `RequireAuth`

Core data hierarchy:

`User -> Course -> Chapter -> Lesson`

Supporting models include:

- `Enrollment`
- `Activity`
- `Review`
- `Category`
- `Language`
- `Levels`
- `Outcome`
- `Requirement`

## Project Structure

```text
.
|-- backend/
|   |-- app/
|   |-- database/
|   |-- public/
|   |-- routes/
|   `-- composer.json
|-- frontend/
|   |-- public/
|   |-- src/
|   `-- package.json
`-- docker-compose.db.yml
```

## API Highlights

Public endpoints:

- `POST /api/register`
- `POST /api/login`
- `GET /api/course-filters`
- `GET /api/all-courses`
- `GET /api/fetch-courses`

Protected endpoints cover:

- courses
- outcomes
- requirements
- chapters
- lessons
- course publishing
- image and video uploads
- current user's courses

## Local Setup

### 1. Start the database

Run MySQL through Docker:

```bash
docker compose -f docker-compose.db.yml up -d
```

### 2. Configure the backend

```bash
cd backend
cp .env.example .env
composer install
php artisan key:generate
php artisan migrate
```

Update `backend/.env` with your local database credentials before running migrations if needed.

### 3. Configure the frontend

The frontend expects this API base URL:

```env
VITE_API_URL=http://localhost:8000/api/
```

Install dependencies:

```bash
cd frontend
npm install
```

### 4. Run both apps

Backend:

```bash
cd backend
composer run dev
```

Frontend:

```bash
cd frontend
npm run dev
```

Default local URLs:

- Laravel API: `http://localhost:8000`
- Vite frontend: `http://localhost:5173`

## Developer Notes

- Backend uploads are stored directly in `backend/public/uploads/`
- Course thumbnails are generated automatically
- Lesson and chapter sorting use drag-and-drop on the frontend
- Sorting endpoints accept ordered arrays such as `[{ id }]`
- The codebase currently keeps most business logic in controllers

## Useful Commands

### Backend

```bash
composer run setup
composer run dev
composer run test
```

### Frontend

```bash
npm run dev
npm run build
npm run lint
```

## Current Gaps

- Automated tests are still minimal
- Some account pages exist in the frontend but may still need backend completion
- The root README was previously a technical note dump; this version is intended as a cleaner onboarding guide
