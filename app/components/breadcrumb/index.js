import React, { Component } from 'react';
import { Breadcrumb } from 'antd';

class breadcrumb extends Component {
  render() {
    return (
      <Breadcrumb separator=">"  style={{ margin: '12px 0 12px 16px' }}>
        {this.props.breadcrumb.split('/').map(function(value, key) {
          return (<Breadcrumb.Item key={key}>{value}</Breadcrumb.Item>);
        })}
      </Breadcrumb>
    );
  }
}

export default breadcrumb;