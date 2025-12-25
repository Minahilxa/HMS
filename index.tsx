
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

console.log('🚀 HealSync HIS: Initializing frontend mount...');

const rootElement = document.getElementById('root');
if (!rootElement) {
  console.error("❌ Critical Error: Could not find root element '#root' in index.html");
} else {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
