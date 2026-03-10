![banner](docs/sander-tf-banner.png)

# sander.tf

sander.tf is my new portfolio written in next.js with a postgresql db.

### Tech Stack:
- Next.JS
- TailwindCSS
- Prisma
- PostgreSQL

## Local Setup Guide

### Prerequisites
- Node.js (v16 or higher)
- PostgreSQL
- Git

### Installation Steps

1. **Clone the repository**
    ```bash
    git clone https://github.com/sanderhd/sander-tf.git
    cd sander-tf
    ```

2. **Install dependencies**
    ```bash
    npm install
    ```

3. **Configure environment variables**
    ```bash
    cp .env.example .env.local
    ```
    Update `.env.local` with your PostgreSQL database URL:
    ```
    DATABASE_URL="postgresql://user:password@localhost:5432/sander_tf"
    ```

4. **Set up the database**
    ```bash
    npx prisma migrate dev
    ```

5. **Start the development server**
    ```bash
    npm run dev
    ```

6. **Open in browser**
    Navigate to `http://localhost:3000`

### Troubleshooting
- Ensure PostgreSQL is running before database setup
- Clear `.next` folder if you encounter build issues: `rm -rf .next`