

import React, { Component } from 'react';

export default class Modal extends Component {
  componentDidMount() {
    window.addEventListener('keydown', this.handleKeyDown);
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.handleKeyDown);
  }

  handleKeyDown = (e) => {
    if (e.code === 'Escape') this.props.onClose();
  };

  handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) this.props.onClose();
  };

  render() {
  const { src, alt } = this.props;
  return (
    <div className="overlay" onClick={this.handleOverlayClick}>
      <div className="modal">
        <img src={src} alt={alt || ''} />
      </div>
    </div>
  );
}
}
