import React, { Component } from 'react';
import { Table, DatePicker, Row, Col, Input, Select, Button, Popconfirm  } from 'antd';

import { Axios } from '../../interface';

const { Option } = Select;
const { RangePicker } = DatePicker;
const ColProps = {
  xl: 4,
  lg: 6,
  md: 8,
  sm: 12,
  xs: 24,
  style: {
    marginBottom: 16,
  },
}

class simMag extends Component {
  render() {
    return (
      <div className="simMag">
        <div className="search-form">
          <Row gutter={24}>
            <Col {...ColProps}>
              <Select style={{ width: "100%" }} placeholder="车厂">
                <Option value="">车厂</Option>
                <Option value="1">1</Option>
              </Select>
            </Col>
            <Col {...ColProps}>
              <Select style={{ width: "100%" }} placeholder="状态">
                <Option value="">状态</Option>
                <Option value="1">1</Option>
              </Select>
            </Col>
            <Col {...ColProps}><Input style={{ width: "100%" }} placeholder="ICCID" /></Col>
            <Col {...ColProps}>
              <Select style={{ width: "100%" }} placeholder="套餐">
                <Option value="">套餐</Option>
                <Option value="1">1</Option>
              </Select>
            </Col>
            <Col {...ColProps}><Input style={{ width: "100%" }} placeholder="终端编号" /></Col>
            <Col {...ColProps}><RangePicker style={{ width: "100%" }} placeholder={['激活开始日期', '激活结束日期']} /></Col>
            <Col {...ColProps}><RangePicker style={{ width: "100%" }} placeholder={['绑定车辆开始日期', '绑定车辆结束日期']} /></Col>
            <Col {...ColProps}>
              <Select style={{ width: "100%" }} placeholder="绑车状态">
                <Option value="">绑车状态</Option>
                <Option value="1">1</Option>
              </Select>
            </Col>
            <Col {...ColProps}><Input style={{ width: "47%" }} placeholder="本月用量" />
              <span style={{ display: 'inline-block', width: "6%", textAlign: "center" }}>~</span>
              <Input style={{ width: "47%" }} /></Col>
            <Col {...ColProps} className="queryBtnGroup">
              <Button type="primary" icon="search" onClick={this.query}>查询</Button> 
              <Button type="primary" icon="download">导出</Button> 
            </Col>
          </Row>
        </div>
        <div className="search-result-list">
           <Table
            columns={this.columns} 
            dataSource={this.state.data}     
            onChange={this.handleTableChange} 
            loading = {this.state.loading}
            pagination = {{
              showTotal: (total, range) => `${range[0]}-${range[1]} 共${total}`,
              showQuickJumper: true,
              showSizeChanger: true,
              pageSize: this.state.pageSize,
            }}
            //rowKey={record => record.key}//key 
            bordered
            size="middle"
            //scroll={{x: 1250}}//宽度
          ></Table>
        </div>
      </div>
    );
  }
  constructor(props) {
    super(props);
    this.state = {
      data: [],//表格数据
      loading: false,//加载ing
      pageSize: 10,
    };
    this.columns =[{
      title: 'key',
      // key: 'key',
      dataIndex: 'key',
    }, {
      title: 'test',
      // key: 'mileage',
      dataIndex: 'mileage',
    },{
      title: '操作',
      key: 'action',
      width: 50,
      render: (text, record) => (
        <span>
          {/* <a>详情</a>
          <span className="ant-divider" /> */}
          <a onClick={(...e) => this.setState({groupItemMagVisible: true})}>详情</a>
          {/* <span className="ant-divider" />
          <Popconfirm title="确定要删除?" onConfirm={""} onCancel={""} okText="Yes" cancelText="No">
            <a onClick={(...e) => console.log(text, record)}>删除</a>
          </Popconfirm>  */}
        </span>
      )
    }];
  }
  query = () => {
    // console.log(this.refs.queryAlarm.value, this.refs.queryVin.value, this.refs.queryState.value, );
    console.log(this.queryFormData);
    this.setState({loading: true});
    Axios({url: '/api/deviceMag'}).then(v => {
      this.setState({
        data: v.data.data,
        loading: false,
      });
    });
    this.setState((preState, prop) => console.log('querySS', preState, prop));
  }
}

export default simMag;