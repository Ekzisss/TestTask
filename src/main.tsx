import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { Helmet } from 'react-helmet';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Helmet>
      <title>TEST</title>
      <meta http-equiv="Content-Security-Policy" content="upgrade-insecure-requests" />
    </Helmet>
    <App />
  </React.StrictMode>
);
