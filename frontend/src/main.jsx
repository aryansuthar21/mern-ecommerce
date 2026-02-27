// frontend/src/main.jsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Provider } from 'react-redux';
import '@fortawesome/fontawesome-free/css/all.min.css';
import App from './App.jsx';
import store from './store/store.js';

import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <Provider store={store}>
        <App />
      </Provider>
    </GoogleOAuthProvider>
  </React.StrictMode>
);
