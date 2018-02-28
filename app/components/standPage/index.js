import React, { Component } from 'react';
import { Table, Row, Col, Select, Input, DatePicker } from 'antd';

import { Axios } from '../../interface';
import { url_getType } from '../../utils/config/api';

class standPage extends Component {
  constructor(props) {
    super(props);
    this.ColProps = {
      xl: 4,
      lg: 6,
      md: 8,
      sm: 12,
      xs: 24,
      style: {
        marginBottom: 16,
      },
    }
  }
  selCarFacOnChange = e => {
    this.data.carFactory = e;
    if(e) {
      Axios({
        url: url_getType,
        data: {
          id: '',
          orgId: e,
          typeName: '',
        }
      }).then(res => {
          this.setState({carTypeSelect: res ? res.data : []});
      });
    }else {
      this.setState({carTypeSelect: []});
    }
  }
  // getSearchItem = () => {

  // }
  // static getSearchBtn = () => {

  // }
  // render() {
  //   return (
  //     <div className="standPage">
  //       <div className="search-form">

  //       </div>
  //       <div className="search-result-list">
  //         <Table />
  //       </div>
  //     </div>
  //   );
  // }
}

export default standPage;