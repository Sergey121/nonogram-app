import React from 'react';
import { Provider } from 'react-redux'
import store from './store';
import './App.scss';
import { Header } from './components/header';

function App() {
  return (
    <Provider store={store}>
      <div className="app">
        <Header/>

      </div>
    </Provider>
  );
}

export default App;
