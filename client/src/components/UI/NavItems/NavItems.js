import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import AuxComp from '../../../hoc/AuxComp/AuxComp';
import styles from './NavItems.module.css';

let rsLocations = [
  {navName: 'Home', navLocation: '/'},
  {navName: 'Login', navLocation: '/pt'}
];

const ptLocations = [
  {navName: 'Home', navLocation: '/pt/landing'},
  {navName: 'Kalender', navLocation: '/pt/my-slots'},
  {navName: 'Beratungszeiten', navLocation: '/pt/set-slot'},
  {navName: 'Anmeldungen', navLocation: '/pt/registrations'},
  {navName: 'Logout', navLocation: '/pt/logout'},
];

const navItems = props => {
  let locations = rsLocations
  if (props.loggedIn) {
    locations = ptLocations;
  }

  const navItemList = locations.map(location => (
      <li key={location.navName} className={styles.NavItem}>
        <Link to={{pathname: location.navLocation}}>{location.navName}</Link>
      </li>
    ));

  return (
    <AuxComp>
      {navItemList}
    </AuxComp>
  )
};

const mapStateToProps = (state) => {
  return {
    loggedIn: state.pt.loggedIn
  }
}

export default connect(mapStateToProps)(navItems);
