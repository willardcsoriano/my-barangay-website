# Project Overview

This is a Next.js project that serves as a starter kit for building applications with Supabase. It includes a basic setup for authentication, data fetching, and UI components. The project uses the Next.js App Router and is configured to work with Supabase for both client-side and server-side rendering.

**Main Technologies:**

*   **Framework:** [Next.js](https://nextjs.org/)
*   **Backend:** [Supabase](https://supabase.io/)
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
*   **UI Components:** [shadcn/ui](https://ui.shadcn.com/)
*   **Authentication:** [Supabase Auth](https://supabase.com/docs/guides/auth) with `@supabase/ssr`

**Architecture:**

The project follows a standard Next.js App Router structure.

*   `app/`: Contains the application's routes and pages.
*   `components/`: Contains reusable React components.
*   `lib/`: Contains utility functions and the Supabase client creation logic.
*   `lib/supabase/client.ts`: Creates a Supabase client for use in client components.
*   `lib/supabase/server.ts`: Creates a Supabase client for use in server components and server-side rendering.

# Building and Running

**1. Installation:**

```bash
npm install
```

**2. Configuration:**

Rename the `.env.local.example` file to `.env.local` and add your Supabase project URL and anon key:

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

**3. Running the Development Server:**

```bash
npm run dev
```

This will start the development server on `http://localhost:3000`.

**4. Building for Production:**

```bash
npm run build
```

**5. Running in Production:**

```bash
npm run start
```

# Development Conventions

*   **Linting:** The project uses ESLint for code linting. You can run the linter with:

    ```bash
    npm run lint
    ```

*   **Styling:** The project uses Tailwind CSS for styling. Utility classes are preferred over custom CSS.
*   **Components:** Components are built using shadcn/ui, which provides a set of accessible and customizable components.
*   **Supabase Client:**
    *   For server-side code (Server Components, Route Handlers, etc.), use the `createClient` function from `lib/supabase/server.ts`.
    *   For client-side code (Client Components), use the `createClient` function from `lib/supabase/client.ts`.
