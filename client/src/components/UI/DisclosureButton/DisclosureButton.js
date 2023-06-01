import React, { Component } from 'react';

import styles from './DisclosureButton.module.css';

class DisclosureButton extends Component {
  state = {
    expanded: false
  }

  toggleExpanded = e => {
    e.preventDefault();
    this.setState({expanded: !this.state.expanded})
  }

  render() {
    return (
      <div>
        <button
          className={styles.Button}
          aria-expanded={this.state.expanded}
          onClick={e => this.toggleExpanded(e)}>

          {this.props.label}

        </button>
        <div style={{display: this.state.expanded?'block':'none'}}>
          <p className={styles.MainText}>{this.props.mainText}</p>
        </div>
      </div>
    )
  }
}

export default DisclosureButton;
