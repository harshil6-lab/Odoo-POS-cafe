import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { AppStateProvider } from './context/AppStateContext';
import { AuthProvider } from './context/AuthContext';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AuthProvider>
        <AppStateProvider>
          <App />
        </AppStateProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
);