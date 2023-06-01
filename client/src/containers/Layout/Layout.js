import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';

import AuxComp from '../../hoc/AuxComp/AuxComp';
import Toolbar from '../../components/UI/Toolbar/Toolbar';
import RS from '../RS/RS';
import PT from '../PT/PT';
import styles from './Layout.module.css';

class Layout extends Component {
  render() {
    return (
      <AuxComp>
        <Toolbar />
        <main className={styles.MainContainer}>
        <Switch>
          <Route exact path="/">
            <RS />
          </Route>
          <Route path="/rs" component={RS} />
          <Route path="/pt" component={PT} />
        </Switch>
        </main>
      </AuxComp>
    );
  }
};

export default Layout;
