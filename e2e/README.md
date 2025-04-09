# E2E Tests with Playwright

This directory contains end-to-end tests using Playwright to validate the calculator application's functionality from a user's perspective.

## Structure

- **specs/** - Test specifications
- **page-objects/** - Page Object Models for interacting with UI components

## Running Tests

Run all e2e tests:
```
npm run e2e
```

Run tests with UI mode (for debugging):
```
npm run e2e:ui
```

Run tests in debug mode:
```
npm run e2e:debug
```

## Current Test Coverage

- Basic calculator rendering
- Digit input functionality
- Simple addition operation
- Clear button functionality

## Adding New Tests

1. Create new spec files in the `specs/` directory
2. Use the Page Object Model pattern by extending or creating new page objects
3. Focus on user journeys and complete workflows