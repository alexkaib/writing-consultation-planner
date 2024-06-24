import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import langStrings from '../../../lang/languageStrings.json';
import AuxComp from '../../../hoc/AuxComp/AuxComp';
import styles from './NavItems.module.css';

const navItems = props => {

  let rsLocations = [
    {navName: 'Home', navLocation: '/'},
    {navName: 'Login', navLocation: '/pt'}
  ];

  const ptLocations = [
    {navName: 'Home', navLocation: '/pt/landing'},
    {navName: langStrings[props.language]['nav_calendar'], navLocation: '/pt/my-slots'},
    //{navName: langStrings[props.language]['nav_schedule'], navLocation: '/pt/set-slot'},
    {navName: langStrings[props.language]['nav_registrations'], navLocation: '/pt/registrations'},
    {navName: 'Logout', navLocation: '/pt/logout'},
  ];

  let locations = rsLocations;
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
    loggedIn: state.pt.loggedIn,
    language: state.rs.language
  }
}

export default connect(mapStateToProps)(navItems);
