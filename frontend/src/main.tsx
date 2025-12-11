import React from 'react';
import ReactDOM from 'react-dom/client';
import AppProvider from './AppProvider';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppProvider />
  </React.StrictMode>
);
