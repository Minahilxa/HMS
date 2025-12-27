import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

console.log("HealSync HIS: Client Application Booting...");

const rootElement = document.getElementById('root');

if (rootElement) {
  console.log("HealSync HIS: Root element found. Mounting React...");
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} else {
  console.error("HealSync HIS Critical Error: Root element 'root' not found in index.html.");
}