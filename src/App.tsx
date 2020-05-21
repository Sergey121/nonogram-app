import React, { useEffect } from 'react';
import './App.scss';
import { tryResolveRow } from './utils';

function App() {
  useEffect(() => {
    const rows = [
      [3],
      [1, 1],
      [1, 1, 1],
      [1, 1],
      [1, 1],
    ];

    const cols = [
      [2, 1],
      [1, 1],
      [1, 1],
      [1, 1],
      [2, 1],
    ];

  }, []);
  return (
    <div className="app">
      App
    </div>
  );
}

export default App;
