import React, { useEffect } from 'react';
import './App.scss';
import { resolveNonogram, tryResolveRow } from './utils';

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

    const res = resolveNonogram(rows, cols);
    console.log(res);

  }, []);
  return (
    <div className="app">
      App
    </div>
  );
}

export default App;
