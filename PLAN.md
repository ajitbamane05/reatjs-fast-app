# Project Plan & Reflection

## Assumptions, Scope, and Approach

### Assumptions
*   **Tech Stack**: The application is built using React (Vite), Tailwind CSS, and React Router v6.
*   **Routing Strategy**: The `react-router-dom` library is the sole handler for client-side routing.
*   **Performance Goals**: The request for lazy loading implies a desire to improve the "First Contentful Paint" (FCP) and reduce the initial bundle size.
*   **UX Preferences**: The request to redirect 404s to Home (rather than showing a specific error page) assumes a preference for keeping users in the flow rather than confronting them with error states, suitable for a smaller or simpler application structure.

### Scope
1.  **404 Handling**: Identify undefined routes and automatically redirect the user to the Landing Page (`/`).
2.  **Code Splitting (Lazy Loading)**: Refactor the main `App` component to load page-level components only when they are needed.

### Approach
1.  **Redirects**: I utilized `react-router-dom`'s wildcard catch-all route (`path="*"`) in combination with the `Navigate` component. This provides a declarative way to handle unknown paths without complex logic.
2.  **Lazy Loading**: I converted all top-level page imports to dynamic imports using `React.lazy()`. I wrapped the entire `Routes` block in a `Suspense` component.
3.  **Fallback UI**: I introduced a lightweight, text-based "Loading..." indicator using existing utility classes (flexbox) to provide immediate feedback during route transitions.

## Scope Changes
*   **Redirect vs. Error Page**: Initially, I considered proposing a dedicated "404 Not Found" page as it is generally better UX to inform the user *why* content is missing. However, I strictly adhered to the user's explicit request: "If page not found then redirect user to home page".
*   **Granularity of Lazy Loading**: I initially considered lazy loading only the Admin routes, as they might be heavier and used less frequently. However, I decided to lazy load *all* page routes (including the Landing Page and Quiz Pages) to ensure the initial bundle is as small as possible, which is a safer default for performance.

## Reflection (Next Steps)

If I had more time, I would focus on the following improvements:

1.  **Enhanced Loading Experience**:
    *   Replace the simple "Loading..." text with **Skeleton Screens** that mimic the layout of the incoming page. This reduces perceived loading time and layout shift (CLS).
    *   Implement **Top Loading Bar** (like standard GitHub/YouTube navigation) to give a sense of progress.

2.  **Robustness & Error Handling**:
    *   Add **Error Boundaries** around the `Suspense` components. Lazy loaded chunks can fail to load (network issues, deployment updates invalidating hashes). An Error Boundary would allow us to show a "Retry" button instead of the app crashing white.
    *   Revisit the 404 strategy: While redirecting to Home is what was asked, purely redirecting can be confusing (e.g., if a user follows a broken link, they end up on the home page with no context). I would implementing a "toast" notification explaining "The page you were looking for doesn't exist, so we brought you home."

3.  **Performance Optimizations**:
    *   Implement **Route Prefetching**: Prefetch the code chunks when a user hovers over a link (or when the link enters the viewport). This makes the navigation feel instant, combining the benefits of lazy loading (small initial bundle) with the speed of eager loading.

4.  **Testing**:
    *   Add specific **End-to-End (E2E) tests** (using Cypress or Playwright) to verify that the redirect actually works in a real browser environment and that the lazy loaded chunks are fetched correctly upon navigation.
