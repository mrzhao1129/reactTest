import React, { Component } from 'react';

import './style.less';

/**
 * just a kuangkuang
 * 
 * @class disDivWithTitle
 * @param {String} this.props.title 标题
 * @extends {Component}
 */
class disDivWithTitle extends Component {
  render() {
    return (
      <div className="comp_disDivWithTitle">
        <b className="disDivWithTitleTitle">{this.props.title}</b>
        {this.props.children}
      </div>
    );
  }
}

export default disDivWithTitle;