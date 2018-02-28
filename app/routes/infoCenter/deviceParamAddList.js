import React, { Component } from 'react';
import { Table } from 'antd';
import axios from 'axios';

class deviceParamAddList extends Component {
  render() {
    return (
      <Table 
        columns={this.columns} 
        dataSource={this.props.data}
        onChange={this.props.handleTableChange} 
        loading = {this.props.loading}
        pagination = {{
          showTotal: (total, range) => `${range[0]}-${range[1]} 共${total}`,
          showQuickJumper: true,
          showSizeChanger: true,
          pageSize: this.props.pageSize,
          current: this.props.current,
          total: this.props.total,
        }}
        bordered
        size='middle'
        rowKey="id"//key
      />
    );
  }
  constructor(props) {
    super(props);
    this.state = {
      //data: [],//表格数据
      //loading: false,//加载ing
      pageSize: 10,
      page: 1,
    }
    this.columns =[{
      title: '车辆编号',
      // key: 'key',
      dataIndex: 'id',
    }, {
      title: 'VIN号',
      // key: 'mileage',
      dataIndex: 'vin',
    }, {
      title: 'TBox编号',
      // key: 'action',
      dataIndex: 'tbox_code',
    }, {
      title: 'ICCID',
      // key: 'action',
      dataIndex: 'iccid',
    }];
  }
  componentDidMount() {
    // let 눈_눈 = '呵呵';
    // let ಠ_ಠ = '呵呵哒';
    // let ಥ_ಥ = '~~~';
    // console.log(눈_눈 + ಠ_ಠ + ಥ_ಥ);
    // axios({url: '/api/deviceMag'}).then(v => {
    //   this.setState({
    //     data: v.data.data,
    //     loading: false,
    //   });
    // });
  }
  
}

export default deviceParamAddList;