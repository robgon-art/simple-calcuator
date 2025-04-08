# simple-calculator
## A simple calculator using React and TypeScript

This project uses the following components for development:

- **Model, View, View Model Architecture (MVVM)**
  - A software architectural pattern that separates the development of the graphical user interface (UI) from the business logic and data:
  - **Model:** Represents the data and business logic of the application. In this calculator, it includes the core calculation functions and data structures.
  - **View:** The user interface components that display information to the user. This includes React components for the calculator display, keypad, and buttons.
  - **ViewModel:** Acts as a data converter that handles the communication between the View and Model. It uses MobX to manage state and provide data binding between the UI and business logic.


- **Programming Languages and Frameworks:**
  - **TypeScript:** A superset of JavaScript that adds static typing, enhancing code quality and maintainability.
  - **React:** A popular JavaScript library for building user interfaces, particularly single-page applications where you can create reusable UI components.
  - **Lit:** A library for building lightweight, fast, and reusable web components. It simplifies the creation of components that can be used across various projects and frameworks.

- **State Management:**
  - **MobX:** A simple, scalable state management library that makes it easier to manage the state of your application. It's known for its minimal boilerplate and reactive data flow.
  - **React Context:** A feature of React that allows for sharing state across components without passing props manually at every level. It's often used for global state management.

- **Build Tools:**
  - **Vite:** A modern, fast build tool and development server. It provides a lean development experience with features like hot module replacement (HMR) and optimized build outputs.

- **Testing Frameworks:**
  - **Vitest:** A next-generation testing framework powered by Vite. It offers a Jest-compatible API and is designed for speed and simplicity in testing JavaScript and TypeScript projects.

- **End-to-End Testing:**
  - **Playwright:** A framework for end-to-end testing that allows you to automate browser actions. It supports multiple browsers and is used to ensure that your application functions correctly from the user's perspective.

- **Component Testing:**
  - **React Testing Library (RTL):** A library for testing React components by simulating user interactions, ensuring that your components behave as expected in a real environment.
