import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { routes } from './routes/index.jsx';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { createHashRouter } from 'react-router-dom';

import './index.css'
const router = createBrowserRouter(routes);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <React.Suspense fallback={<div>Loading...</div>}>
    <App />
    <RouterProvider router={router} />
    </React.Suspense>
  </React.StrictMode>,
)
