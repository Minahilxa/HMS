import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

console.log("HealSync HIS: Booting Client Application...");

const rootElement = document.getElementById('root');

if (rootElement) {
  console.log("HealSync HIS: Root element found. Mounting React tree.");
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} else {
  console.error("HealSync HIS Critical: Root element 'root' not found in DOM. Check index.html.");
}