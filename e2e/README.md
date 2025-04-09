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

### Phase 1: Basic Functionality
- Basic calculator rendering
- Digit input functionality
- Simple addition operation (2+2=4)
- Clear button functionality

### Phase 2: Advanced Operations and Error Handling
- Additional mathematical operations
  - Subtraction (8-3=5)
  - Multiplication (6*7=42)
  - Division (10/2=5)
- Decimal point functionality (1.5+2.5=4)
- Error handling
  - Division by zero
  - Large number calculations

## Adding New Tests

1. Create new spec files in the `specs/` directory
2. Use the Page Object Model pattern by extending or creating new page objects
3. Focus on user journeys and complete workflows

## Future Improvements

- Visual regression testing
- Keyboard input testing
- Multi-step calculation testing
- Accessibility testing