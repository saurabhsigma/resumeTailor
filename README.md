# Freelancer Personal Work Repository

A production-quality SaaS foundation for freelancers, built with Next.js App Router, MongoDB, and Tailwind CSS.

## Features

- **Dashboard**: Track active projects, deadlines, and financials.
- **Client Management**: CRM-lite for managing client details and notes.
- **Project Management**: Full lifecycle tracking with Milestones, Files, Notes, and Invoices.
- **Invoices**: Simple tracking of sent/paid/overdue payments.
- **Authentication**: Secure email/password auth with HTTP-only sessions.

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: MongoDB (Mongoose)
- **Auth**: Custom JWT (jose)
- **Icons**: Lucide React

## Getting Started

### 1. Environment Setup

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000).

### 4. Seed Data (Optional)

To populate the database with a demo user and sample data:

1. Ensure the server is running.
2. Visit [http://localhost:3000/api/seed](http://localhost:3000/api/seed) in your browser.
3. You should see `{"message": "Seed successful", ...}`.
4. Log in with:
   - **Email**: `demo@example.com`
   - **Password**: `password`

## Folder Structure

- `/app`: App Router pages and layouts.
- `/components/ui`: Reusable atomic components (Button, Card, Input).
- `/components/features`: Domain-specific components (Forms, Tabs).
- `/lib`: Utilities (DB connection, Auth helpers).
- `/models`: Mongoose schemas.
- `/server/actions`: Server Actions for data mutation and fetching.

## Design Philosophy

Information-dense, calm, and professional. Designed to feel like a premium tool (Linear-esque) rather than a bootstrap template.
