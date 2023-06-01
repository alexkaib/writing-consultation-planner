import React, { Component } from 'react';
import { HashRouter } from 'react-router-dom';
import './App.css';

import Layout from './containers/Layout/Layout';

class App extends Component {
  render() {
    return (
      <HashRouter>
        <Layout />
      </HashRouter>
    );
  }
}

export default App;
