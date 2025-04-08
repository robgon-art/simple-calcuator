import React from 'react';
import Calculator from './components/Calculator';
import './App.css';

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1>Simple Calculator</h1>
      </header>
      <main>
        <Calculator />
      </main>
      <footer className="app-footer">
        <p>A simple calculator built with React and TypeScript</p>
      </footer>
    </div>
  );
}

export default App;
