# ChainSentryAI Developer Documentation

This document provides a comprehensive technical overview of the ChainSentryAI frontend prototype. It is intended for developers working on the project to understand its architecture, code structure, and design rationale.

## 1. System Overview

### 1.1. Architecture

This project is a **frontend-only prototype** built as a React Single-Page Application (SPA). Its primary purpose is to demonstrate the user experience and core features of the ChainSentryAI product without a live backend.

-   **Data Source**: All data is statically mocked in `src/demo.ts`. This includes user audits, findings, code snippets, and AI-generated explanations.
-   **State Management**: Application state (e.g., current page, selected audit) is managed within the root `App.tsx` component using React's built-in `useState` and `useCallback` hooks.
-   **Component Library**: The UI is built with a set of reusable components in `src/components/ui/`, styled to mimic the popular `shadcn/ui` library for a consistent and professional look.

The **intended production architecture** is a full-stack monorepo application:
-   **Frontend**: Next.js
-   **Backend API**: FastAPI (Python) or Node/Express
-   **Audit Engine**: A separate Python service using Celery/Redis for queuing.
-   **Database**: PostgreSQL with Prisma or SQLAlchemy.
-   **Authentication**: Firebase Auth / Web3Auth.

### 1.2. Data Flow

1.  **Initialization**: `index.tsx` renders the `App.tsx` component.
2.  **Navigation**: The `Sidebar` component contains navigation links. Clicking a link calls the `onNavigate` function passed down from `App.tsx`, which updates the `currentPage` state.
3.  **Page Rendering**: `App.tsx` contains a `renderPage()` function that acts as a simple router, rendering the appropriate page component (`DashboardPage`, `NewAuditPage`, etc.) based on the `currentPage` state.
4.  **Audit Simulation**:
    -   On `NewAuditPage`, clicking "Start Hybrid Analysis" calls `onStartAudit`.
    -   `App.tsx` sets `isAuditing` to `true`, which causes `AuditProgress` to be rendered.
    -   A `setTimeout` simulates the audit duration.
    -   After the timeout, `isAuditing` is set to `false`, a demo audit is loaded into the `selectedAudit` state, and `currentPage` is changed to `audit-detail`.
5.  **Data Display**: Page components and their children access data either passed down as props (e.g., `AuditDetailPage`) or by directly importing from `src/demo.ts` (e.g., `DashboardPage`).

### 1.3. Folder Structure

```
/src
|-- /components
|   |-- /audit       # Components specific to the audit process (e.g., progress screen)
|   |-- /layout      # Layout components like the Sidebar
|   |-- /ui          # Reusable, generic UI components (Button, Card, Badge)
|-- /pages           # Top-level components for each page/view
|-- App.tsx          # Root component, state management, and routing
|-- demo.ts          # Mock data for audits and findings
|-- index.tsx        # Application entry point
|-- types.ts         # Centralized TypeScript type definitions
```

## 2. Core Components & Modules

-   **`App.tsx`**: The orchestrator of the application. It holds the primary state for navigation and audit flow. Its `renderPage` function serves as a client-side router.
-   **`pages/`**: Each file corresponds to a major view. They are responsible for fetching (simulated) data and composing the layout for that view using `Card` and other UI components.
-   **`components/ui/`**: These are "dumb" presentational components designed for maximum reusability. They follow the `shadcn/ui` convention of being self-contained and styled with Tailwind CSS variants.
-   **`types.ts`**: Defines the data structures (`Audit`, `Finding`, `Severity`) used throughout the app. This ensures type safety and serves as a single source of truth for the data model.
-   **`demo.ts`**: A critical file for the prototype. It exports the `DEMO_AUDITS` array, which mimics the response that would come from a backend API. To add or modify demo content, this is the file to edit.

## 3. The Audit Pipeline (Simulated)

The frontend simulates the complex, multi-stage audit pipeline described in the product specification.

-   **Ingestion (`NewAuditPage`)**: The UI provides options for GitHub or file upload. In the prototype, this simply triggers the audit flow without processing input.
-   **Analysis (`AuditProgress.tsx`)**: This component visually represents the pipeline stages. The `useEffect` hook with a `setInterval` cycles through the steps to create a realistic sense of progress. The steps listed directly correspond to the advanced algorithms (Taint Analysis, Symbolic Execution, SCC, etc.) that the real engine would perform.
-   **Reporting (`AuditDetailPage.tsx`)**: This page is the final output. It's designed to render the rich data structure defined in `types.ts`, showcasing the results of the (simulated) analysis.

## 4. Algorithms & Data Structures (Conceptual)

While not implemented in this frontend code, the UI is designed to support the outputs of sophisticated backend algorithms.

-   **Control-Flow & Data-Flow Graphs (CFG/DFG)**: The "Trace Graph" tab in the audit report is designed to visualize data that would be derived from these graphs, showing how user input (`source`) can influence a sensitive operation (`sink`).
-   **Taint Analysis**: The logic for identifying sources and sinks is a core part of taint analysis. The trace graph is a direct representation of a successful taint flow.
-   **Tarjan's SCC / Dominator Trees**: Findings like "Reentrancy" or "Missing Access Control" would be discovered by the backend using these graph algorithms on the contract's call graph and CFG. The frontend simply presents the resulting finding.

## 5. Architectural Decisions & Trade-offs

-   **React SPA vs. Next.js**: A simple React SPA (using Vite) was chosen for this prototype for its fast setup and development speed. This allows for rapid iteration on the UI and UX, which is the primary goal. A full-featured product would use Next.js for SSR, routing, and API routes.
-   **Local State vs. State Management Library**: Simple component state (`useState`) and prop drilling are sufficient for the prototype's complexity. A larger application would likely benefit from a dedicated state management library like Redux Toolkit, Zustand, or React Query for handling API state.
-   **Demo Data vs. API**: Using a static `demo.ts` file completely decouples the frontend from any backend dependencies, making it easy to run and test in isolation. The clear separation of data fetching (even if mocked) makes it straightforward to replace the static import with API calls in the future.

## 6. Future Development & Maintenance

-   **Adding a New Finding**: To add a new vulnerability to the demo, simply add a new `Finding` object to the `findings` array of an `Audit` in `src/demo.ts`. Ensure it conforms to the `Finding` interface in `types.ts`.
-   **Transitioning to a Live API**:
    1.  Identify all locations where `DEMO_AUDITS` is imported.
    2.  Replace these static imports with data-fetching hooks (e.g., `useSWR`, `react-query`).
    3.  Add loading and error states to the UI to handle the asynchronous nature of API calls.
    4.  The `onStartAudit` function in `App.tsx` would be modified to make a `POST` request to the backend API to initiate an audit, likely polling for completion status.