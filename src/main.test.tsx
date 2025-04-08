import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import App from './App';

// Mock react-dom/client
vi.mock('react-dom/client', () => ({
    createRoot: vi.fn(() => ({
        render: vi.fn()
    }))
}));

// Mock App component
vi.mock('./App', () => ({
    default: () => <div data-testid="mock-app">App Component</div>
}));

describe('main.tsx', () => {
    let root: HTMLElement;

    beforeEach(() => {
        // Create a root element
        root = document.createElement('div');
        root.id = 'root';
        document.body.appendChild(root);
    });

    afterEach(() => {
        // Cleanup
        document.body.removeChild(root);
        vi.clearAllMocks();
    });

    it('should render App component in StrictMode', async () => {
        // Import main to trigger the rendering
        await import('./main');

        // Verify createRoot was called with the root element
        expect(ReactDOM.createRoot).toHaveBeenCalledWith(root);

        // Get the render function that was returned by createRoot
        const renderFn = (ReactDOM.createRoot as any).mock.results[0].value.render;

        // Verify render was called
        expect(renderFn).toHaveBeenCalled();

        // Check that the first argument to render is a StrictMode component
        const renderArg = renderFn.mock.calls[0][0];
        expect(renderArg.type).toBe(StrictMode);

        // Check that StrictMode wraps App component
        expect(renderArg.props.children.type).toBe(App);
    });
});