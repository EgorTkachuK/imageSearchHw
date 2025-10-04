
import React, { Component } from 'react';

export default class Searchbar extends Component {
  state = { input: '' };

  handleChange = (e) => this.setState({ input: e.target.value });

  handleSubmit = (e) => {
    e.preventDefault();
    const value = this.state.input.trim();
    if (!value) return;
    this.props.onSubmit(value);
    this.setState({ input: '' });
  };

  render() {
    return (
      <header className="searchbar">
        <form className="form" onSubmit={this.handleSubmit}>
          <button type="submit" className="button">
            <span className="button-label">Search</span>
          </button>
          <input
            className="input"
            type="text"
            value={this.state.input}
            onChange={this.handleChange}
            autoComplete="off"
            autoFocus
            placeholder="Search images and photos"
          />
        </form>
      </header>
    );
  }
}
