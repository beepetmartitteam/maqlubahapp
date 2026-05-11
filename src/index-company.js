import React from 'react';
import ReactDOM from 'react-dom/client';
import CompanyApp from './CompanyApp';

const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);

root.render(
  <React.StrictMode>
    <CompanyApp />
  </React.StrictMode>
);
