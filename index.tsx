import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

console.log("HealSync HIS: Initializing Client Application...");

const rootElement = document.getElementById('root');

if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} else {
  console.error("Critical: Root element 'root' not found in DOM.");
}