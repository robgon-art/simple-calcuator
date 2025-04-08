# Calculator App Development Approach

## Component Hierarchy
```
/
├── src/
│   ├── components/
│   │   ├── Calculator/                 # Main container
│   │   ├── Display/                    # Shows calculation input/result
│   │   ├── Keypad/                     # Contains all buttons
│   │   ├── Button/                     # Individual calculator button
│   │   └── History/                    # Lit component for calculation history
│   ├── store/                          # MobX state management
│   ├── utils/                          # Pure calculation functions
│   ├── types/                          # TypeScript type definitions
│   ├── App.tsx
│   └── main.tsx
├── e2e/                                # Playwright tests
└── config files                        # Vite, TypeScript, etc.
```

## Development Approach

1. **Functional Programming**
   - Emphasize immutable data structures
   - Use pure functions for calculations and transformations
   - Avoid side effects in business logic
   - Leverage function composition for complex operations
   - Separate data transformation from effects
   - Handle state changes through well-defined interfaces


2. **Pure Calculation Logic**
   - Create pure functions for all mathematical operations
   - Each function should have a single responsibility
   - All functions return new values rather than mutating existing ones

3. **State Management**
   - Use MobX for the calculator state (current input, previous inputs, operations)
   - Create observable store with computed values for derived state
   - React Context to provide store access throughout the component tree

4. **Component Design**
   - Create small, focused components with single responsibilities
   - Button component handles single button presses
   - Keypad arranges and organizes buttons
   - Display shows current input and result
   - Calculator orchestrates the components
   - History component built with Lit for displaying previous calculations

## Testing Strategy

1. **Unit Tests (Vitest)**
   - Test pure calculation functions in isolation
   - Test store operations without UI components
   - Focus on behavior rather than implementation
   - Use given-when-then pattern for test organization
   - Avoid mocks
   - Use colocated test files

2. **Component Tests (React Testing Library)**
   - Test components in isolation
   - Verify rendering and user interactions
   - Check that components respond correctly to props and state changes
   - Test accessibility features

3. **Integration Tests**
   - Test combinations of components together
   - Verify that data flows correctly between components
   - Test state management integration

4. **E2E Tests (Playwright)**
   - Test complete user flows (performing calculations)
   - Test across multiple browsers
   - Verify visual appearance and functionality
   - Test edge cases like large numbers and error states

This approach ensures highly testable code without mocks by using functional programming principles and clean separation of concerns.