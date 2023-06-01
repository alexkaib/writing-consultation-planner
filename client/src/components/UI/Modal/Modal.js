import React, { Component } from 'react';

import AuxComp from '../../../hoc/AuxComp/AuxComp';
import Backdrop from '../Backdrop/Backdrop';

import styles from './Modal.module.css';

class Modal extends Component {
  constructor(props) {
    super(props);
    // This binding is necessary to make `this` work in the callback
    this.handleKey = this.handleKey.bind(this);
    this.modalRef = React.createRef();
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.visible !== this.props.visible || nextProps.children !== this.props.children;
  }

  handleKey (e) {
    if (this.props.visible) {
      // handle Escape
      if (e.keyCode === 27) {
        this.props.onBackdropClick();
      }
      // create focus trap
      else if (e.keyCode === 9) {
        const focusableModalElements = this.modalRef.current.querySelectorAll(
          'a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select'
        );

        const firstElement = focusableModalElements[0];
        const lastElement =  focusableModalElements[focusableModalElements.length - 1];

        if (!this.modalRef.current.contains(document.activeElement)) {
          firstElement.focus();
          return e.preventDefault();
        }

        if (!e.shiftKey && document.activeElement === lastElement) {
          firstElement.focus();
          return e.preventDefault();
        }

        if (e.shiftKey && document.activeElement === firstElement) {
          lastElement.focus();
          return e.preventDefault();
        }
      }
    }
  }

  componentDidMount () {
    document.addEventListener("keydown", this.handleKey);
  }

  componentWillUnmount () {
    document.removeEventListener("keydown", this.handleKey);
  }

  render() {
    return (
      <AuxComp>
        <Backdrop visible={this.props.visible} onBackdropClick={this.props.onBackdropClick} />
        <div aria-modal="true" role="dialog" ref={this.modalRef} className={styles.Modal} style={{
          transform: this.props.visible ? 'translateY(0)':'translateY(-100vh)',
          opacity: this.props.visible ? '1': '0',
        }}>
          <button className={styles.CloseButton} aria-label="Schließen" onClick={this.props.onBackdropClick}>X</button>
          {this.props.children}
        </div>
      </AuxComp>
    );
  }
};

export default Modal;
