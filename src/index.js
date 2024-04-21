import React from 'react';
import ReactDOM from 'react-dom';
import DataFetcher from './DataFetcher'; // Ensure this path is correct
import './app.css'; // This is fine as long as app.css is in the same directory as index.js

ReactDOM.render(
  <React.StrictMode>
    <DataFetcher />
  </React.StrictMode>,
  document.getElementById('root')
);
