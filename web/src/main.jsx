import React from 'react';
import ReactDOM from 'react-dom/client';
import { ensureCsrf } from './api/client.js';
import App from './App.jsx';


ensureCsrf(); // pre-fetch CSRF token for smoother first mutation

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
