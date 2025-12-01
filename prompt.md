
##prompt 

Note you wil not call direct external services for usermanagement or stripe and all, you will be calling my localhost backen services .
Landing Page: Clean, Modern Design: Minimalist layout with a focus on usability and aesthetics.
Framework: Use Next.js for its server-side rendering capabilities and React-based architecture.

Styling: Implement Tailwind CSS for a responsive and modern design.
Hero Section:

Bold Headline & Subheadline: Clearly communicate the core value proposition.

Primary CTA Button: Prompt users to sign up or get started.

Features Section:

Feature Highlights: Brief descriptions of key features, each with an accompanying icon or image.

Screenshots or Visual Demos: Showcasing the product in action.

Pricing Section:

Plan Comparison Table: Clear comparison of Free, Pro, and Premium tiers, highlighting features and pricing.

Upgrade/Downgrade Options: Buttons for users to easily change their plan.

Testimonials:

User Reviews: Quotes from satisfied customers to build credibility.

Footer:

Links: Privacy policy, terms of service, and social media icons.

Dashboard:

User Overview:

Plan Indicator: Display the user’s current subscription tier prominently.

Profile Information: Quick access to user settings and preferences.

Feature Panels:

Security Insights: Overviews of security status, vulnerabilities, and recommended actions.

Activity Logs: View recent activities and alerts.

Management Tools:

User Management: Controls for managing user roles and permissions.

Plan Management: Options to upgrade, downgrade, or change subscription details.

Notifications & Alerts:

Phase 1: Setup, Architecture, and Core Components (Prompts 1-8)

Prompt #	Task Title	Detailed Tasks (4-5 per prompt)
P-F-1	Project Setup, Styling, and Test Environment Configuration	1. Initialize the project (e.g., React/Next.js) and install the chosen UI/Styling library (e.g., Tailwind CSS). 2. Install and configure the frontend testing framework (e.g., Jest and React Testing Library (RTL)) and define a src/__tests__ structure. 3. Define the base layout component (header, footer, main container). 4. V&V: Write a Unit Test for the base layout to assert proper rendering and verify the test environment is fully operational.
P-F-2	Clerk SDK Integration and User Context V&V	1. Integrate the Clerk frontend SDK and wrap the application with its provider. 2. Implement a global AuthContext that extracts and provides the user's login status and JWT. 3. Create the public Sign-In/Sign-Up pages using Clerk components. 4. V&V: Write Unit Tests for the AuthContext to assert it correctly reports logged-in/logged-out states based on the Clerk mock session.
P-F-3	Secure API Client and Authorization Header V&V	1. Create a centralized API Client utility (e.g., Axios instance) for all custom backend calls. 2. Configure the client to automatically fetch the user's Clerk JWT and attach it as the Authorization: Bearer header. 3. Implement a standardized error handler (e.g., toast system) for displaying API errors (400, 500). 4. V&V: Write a Unit Test for the API client to assert that the Authorization header is correctly formed and included in every outgoing request.
P-F-4	Landing Page Structure and Navigation V&V	1. Design the main / landing page with a hero section and descriptive copy. 2. Implement the persistent navigation header component with links (Pricing, Login, Dashboard). 3. Create the Routing Guard logic to redirect unauthenticated users away from protected routes. 4. V&V: Write a Component Integration Test to verify the Navigation Header renders correctly, and a Router Test to assert the Guard redirects unauthorized access attempts to the login page.
P-F-5	State Management Setup and Integration V&V	1. Install and configure the chosen state management library (e.g., Zustand, Redux). 2. Define the initial global state structure for user profile and subscription status (planName, isActive). 3. Integrate the state management provider into the application root. 4. V&V: Write Unit Tests for the state store/reducer to assert that the initial state is correct and that basic actions (e.g., setUser) correctly update the state object.
P-F-6	The Professional Pricing Card Component V&V	1. Create a highly professional, reusable Pricing Card component that accepts plan details (name, features, price) as props. 2. Implement conditional rendering to display "Subscribe" or "Current Plan" based on the user's active plan state. 3. Add styling to visually highlight the "Most Popular" plan. 4. V&V: Write a Component Test (RTL) to assert that the component renders the correct price and plan features, and that the button text changes based on the input isCurrentPlan prop.
P-F-7	Subscription Initiation Flow Implementation	1. Implement the click handler for the "Subscribe" buttons on the Pricing Cards. 2. The handler must call the secure backend endpoint P-B-7 (POST /api/v1/subscriptions/checkout-session) passing the plan ID. 3. Upon success, safely redirect the user to the returned Stripe Checkout URL. 4. V&V: Write an Integration Test that mocks the backend API call and asserts that upon button click, the application calls the correct endpoint and navigates to the returned mock URL.
P-F-8	Post-Checkout Success and Failure Pages V&V	1. Create the dedicated /checkout/success and /checkout/failure pages. 2. On the success page, display a confirmation message and a link back to the Dashboard. 3. On the failure page, display the error and a link back to the Pricing page. 4. V&V: Write Unit Tests for both pages to assert the correct primary message and navigation links are visible, handling any URL query parameters.

Phase 2: Dashboard and Core API Integration (Prompts 9-16)

Prompt #	Task Title	Detailed Tasks (4-5 per prompt)
P-F-9	The Dashboard Main Structure and Layout V&V	1. Create the protected /dashboard route. 2. Design the dashboard layout with a clear sidebar navigation (Profile, Billing, Settings) and a main content area. 3. Implement skeleton loading components for the main content area. 4. V&V: Write an Integration Test that simulates a logged-in user viewing the page and asserts that the main sidebar links are all rendered, and the skeleton component is initially visible.
P-F-10	Dashboard: Current Plan Display and Fetch V&V	1. On dashboard component mount, fetch the user's current subscription details from the backend endpoint P-B-9 (GET /api/v1/subscriptions/current-plan). 2. Display the plan name, status, and renewal date prominently. 3. Implement logic to display a clear "Upgrade Now" or "Manage Plan" button based on the status. 4. V&V: Write an Integration Test that mocks a successful API response and asserts the component updates the global state (P-F-5) and correctly displays the mock plan name and status on the UI.
P-F-11	Dashboard: Profile Management Form V&V	1. Create the form component on /dashboard/profile using a form library (e.g., React Hook Form). 2. Fetch initial user data using P-B-5 (GET /api/v1/users/me) to populate the form fields. 3. Implement client-side validation that mirrors the backend's validation rules (P-B-17) before submission. 4. V&V: Write an Integration Test to assert that the form is populated with mocked API data, and write a Unit Test to verify the client-side validation correctly prevents submission of invalid data (e.g., empty name).
P-F-12	Profile Update Submission and Feedback V&V	1. Implement the form submission logic to send the updated data to P-B-5 (PATCH /api/v1/users/me). 2. Provide clear user feedback ("Profile Updated!") upon successful submission using the notification system (P-F-3). 3. Implement state handling to disable the submit button while the API call is in progress. 4. V&V: Write an Integration Test that simulates a successful form submission and asserts that the correct API endpoint is called and the success notification is displayed to the user.
P-F-13	Dashboard: Billing Management Interface V&V	1. Create the /dashboard/billing page. 2. Implement a clear call-to-action button labeled "Manage Billing & Invoices." 3. The click handler must call the backend endpoint P-B-10 (POST /api/v1/billing/portal) and redirect to the returned URL. 4. V&V: Write an Integration Test that validates the button click successfully triggers the API call and redirects the user to a mocked Stripe Billing Portal URL.
P-F-14	GraphQL Client Setup and Integration V&V	1. Install and configure the necessary GraphQL client (e.g., Apollo Client) and connect it to the custom backend's /graphql endpoint (P-B-15). 2. Integrate the authentication header logic (P-F-3) into the GraphQL client. 3. Write a placeholder component to execute the me GraphQL query. 4. V&V: Write a Unit Test for the GraphQL client configuration to assert it correctly forms a query and includes the required authentication token.
P-F-15	File Upload Component Logic V&V	1. Create a reusable file upload component for assets (e.g., avatar image). 2. The initiation logic must first call the backend endpoint P-B-12 (POST /api/v1/upload/file-url) to get a secure presigned URL. 3. Implement the logic to use the returned presigned URL for the direct file upload. 4. V&V: Write an Integration Test for the component to assert that a simulated file upload correctly triggers the two required, sequential network calls: one to the custom backend and one to the storage service mock.
P-F-16	Global Error and Loading States V&V	1. Refactor the API client (P-F-3) to handle global network loading state (show/hide global spinner). 2. Implement robust error boundaries for top-level components to gracefully catch rendering errors. 3. Define all i18n keys for error and success messages. 4. V&V: Write Integration Tests that simulate a network failure (e.g., a 500 error from the API client) and assert that the application displays a persistent, user-friendly global error message.

Phase 3: Testing, Optimization, and Final Polish (Prompts 17-25)

Prompt #	Task Title	Detailed Tasks (4-5 per prompt)
P-F-17	Refactor: Switching to GraphQL for Profile V&V	1. Refactor the profile data fetch (P-F-11) to use the GraphQL query for the me object (P-B-15) instead of the REST endpoint. 2. Update the state management (P-F-5) to handle the new GraphQL response structure. 3. Remove the old REST fetch logic for this data. 4. V&V: Write a Component Test that uses the GraphQL mock provider to ensure the profile page renders the data successfully via the new GraphQL path.
P-F-18	E2E Test: Full User Onboarding Flow	1. Set up the E2E testing framework (e.g., Cypress or Playwright). 2. Write the End-to-End (E2E) test script for the full Signup → Login → Dashboard flow. 3. The script must assert that all pages load, the Auth Guard works, and the user's name (P-F-10) is displayed correctly on the dashboard. 4. V&V: Configure the test runner to execute this E2E script and generate a report showing successful completion of the onboarding flow.
P-F-19	E2E Test: Subscription Purchase Flow	1. Write the E2E test script for the full Pricing Page → Subscribe Button Click → Redirect flow. 2. The script must verify that the subscribe button is clicked and the application is redirected to an external URL (mocked to simulate Stripe). 3. Write an E2E test to verify clicking the "Manage Billing" button (P-F-13) redirects to the portal. 4. V&V: Execute this E2E script and verify the critical purchasing actions are correctly handled without breaking the client application.
P-F-20	Accessibility (A11y) Review and Automated Testing	1. Ensure all interactive components (forms, buttons) have proper ARIA attributes and keyboard navigation is functional. 2. Verify all color contrasts meet WCAG 2.1 AA standards. 3. Integrate an A11y Testing Library (e.g., Jest-Axe) into the test suite. 4. V&V: Run automated A11y checks on the Landing Page and Dashboard components and correct any reported violations.
P-F-21	Performance Optimization and Metrics V&V	1. Implement lazy loading for images and route-based code splitting to reduce the initial load bundle size. 2. Optimize image assets using modern formats (e.g., WebP). 3. Implement dynamic component imports for non-critical features (e.g., the Settings page). 4. V&V: Run a Lighthouse Audit on the production build and document the Core Web Vitals scores (LCP, FID, CLS).
P-F-22	Dark Mode/Light Mode Toggle V&V	1. Implement a theme context provider and create a visible Theme Toggle component. 2. Apply theme-switching logic using CSS variables or utility classes across the main UI components. 3. Store the user's preference in local storage. 4. V&V: Write a Component Test (RTL) to assert that clicking the toggle correctly changes the theme class/state of the main container.
P-F-23	Settings Page and Secure Account Deletion V&V	1. Create the /dashboard/settings page with a prominent Logout button (using Clerk SDK). 2. Implement a secure, multi-step Delete Account function with a final confirmation modal. 3. Write the handler to call a highly protected backend deletion API (placeholder integration). 4. V&V: Write an Integration Test to verify the Logout button clears the session, and a Unit Test for the confirmation modal to ensure the user must explicitly confirm the delete action.
P-F-24	Deployment Configuration and CI/CD Setup	1. Finalize the deployment configuration (e.g., Vercel/Netlify config file). 2. Define all necessary public environment variables (Clerk Public Key, API URL). 3. Configure the build process to run the Unit Test Suite and fail the build if any tests fail. 4. V&V: Verify the deployed staging environment correctly communicates with the backend, specifically checking for CORS errors (P-B-2).
P-F-25	Final Regression Test Suite and Documentation	1. Assemble all previously written Unit, Integration, and E2E tests into a single, comprehensive Regression Test Suite. 2. Create a clean, organized component documentation library (e.g., Storybook or equivalent) for all reusable UI components. 3. Conduct a final review of all network calls to ensure they are secure and using the custom backend. 4. V&V: Execute the Full Regression Test Suite against a staging environment and ensure 100% test pass rate before production deployment.
