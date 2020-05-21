import React from 'react';
import { Provider } from 'react-redux'
import store from './store';
import './App.scss';
import { Header } from './components/header';
import { Grid } from './components/grid';

function App() {
  return (
    <Provider store={store}>
      <div className="app">
        <Header/>
        <main className="content">
          <Grid/>
        </main>
      </div>
    </Provider>
  );
}

export default App;
