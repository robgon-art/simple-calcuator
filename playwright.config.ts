import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
    testDir: './e2e',
    // Only run tests in files that match this pattern
    testMatch: '**/*.spec.ts',
    // Run tests in files in parallel
    fullyParallel: false,
    // Fail the build on CI if you accidentally left test.only in the source code
    forbidOnly: !!process.env.CI,
    // Retry on CI only
    retries: process.env.CI ? 2 : 1,
    // Reporter to use
    reporter: 'html',
    // Shared settings for all the projects below
    use: {
        // Base URL to use in actions like `await page.goto('/')`
        baseURL: 'http://localhost:5173',
        // Collect trace when retrying the failed test
        trace: 'on-first-retry',
        // Take screenshot on failure
        screenshot: 'on',
        // Increase timeouts
        navigationTimeout: 30000,
        actionTimeout: 15000,
    },
    // Configure projects for different browsers
    projects: [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] },
        },
    ],
    // Local development server to run before tests
    webServer: {
        command: 'npm run dev',
        url: 'http://localhost:5173',
        reuseExistingServer: !process.env.CI,
        stdout: 'pipe',
        stderr: 'pipe',
        timeout: 60000, // Give server 60 seconds to start
    },
}); 