
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

console.log('%c🚀 HealSync HIS: Initializing frontend mount...', 'color: #0ea5e9; font-weight: bold; font-size: 14px;');

const rootElement = document.getElementById('root');

if (!rootElement) {
  console.error("❌ Critical Error: Could not find root element '#root' in index.html. Ensure the HTML has <div id='root'></div>.");
} else {
  try {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    console.log('%c✅ HealSync HIS: Render triggered successfully.', 'color: #22c55e; font-weight: bold;');
  } catch (error) {
    console.error("❌ Critical Error during React mounting:", error);
    rootElement.innerHTML = `
      <div style="padding: 20px; color: red; font-family: sans-serif;">
        <h2>Frontend Mount Failed</h2>
        <p>A JavaScript error occurred during initialization. Please check the browser console (F12) for details.</p>
      </div>
    `;
  }
}
