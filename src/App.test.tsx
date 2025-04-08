import { render, screen } from '@testing-library/react';
import { describe, test, expect } from 'vitest';
import App from './App';

describe('App component', () => {
    test('renders header with correct title', () => {
        render(<App />);
        const headerElement = screen.getByRole('heading', { level: 1, name: /Simple Calculator/i });
        expect(headerElement).toBeInTheDocument();
    });

    test('renders Calculator component', () => {
        render(<App />);
        // This is a basic test that assumes the Calculator is rendered
        // We could make this more specific if we know what Calculator renders
        const mainElement = screen.getByRole('main');
        expect(mainElement).toBeInTheDocument();
    });

    test('renders footer with correct text', () => {
        render(<App />);
        const footerText = screen.getByText(/A simple calculator built with React and TypeScript/i);
        expect(footerText).toBeInTheDocument();
    });
}); 