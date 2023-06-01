import React from 'react';
import { connect } from 'react-redux';

import enImg from '../../assets/union-jack.png';
import deImg from '../../assets/german.png';
import styles from './Logo.module.css';

const langLogo = (props) => {
  let imgSrc = enImg;
  if (props.english) {
    imgSrc = deImg;
  }
  return (
    <div className={styles.Flag}>
      <img onClick={props.onLangButton} src={imgSrc} alt="Switch Language Button" />
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    english: state.rs.english
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onLangButton: () => dispatch({type: 'SWITCH_LANG'})
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(langLogo);
