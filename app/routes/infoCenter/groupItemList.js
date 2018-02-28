import React, { Component } from 'react';
import { Table, Row, Col, Input, Button, Modal, Select, Popconfirm, message, Upload, DatePicker } from 'antd';
import axios from 'axios';

import '../layout/style.less';
import { Axios } from '../../interface';
import { url_getGroupCar, url_postGroupCar, url_delGroupCar, url_postGroupCarByExcel, url_getMenuType } from '../../utils/config/api';
import { StandModal, MoreModal } from '../../components'
import { getSelectOrg } from '../../actions';

const {Option} = Select;
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
class groupItemListMag extends Component {
  render() {
    return (
      <div className="sysMag">
        <div className="search-form">
          <Row gutter={24}>
            <Col  {...ColProps} className="queryBtnGroup">
              <Button type="primary" icon="search" onClick={this.query.bind(null, 1, 10)}>查询</Button> 
              <Button type="primary" icon="close" onClick={this.doDels}>删除</Button> 
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
              current: this.state.current,
              total: this.state.total,
            }}
            rowKey="id"//key
            bordered
            size="middle"
            //scroll={{x: 1250}}//宽度
            rowSelection={{
              onChange: (selectedRowKeys, selectedRows) => {
                console.log(`selectedRowKeys:`, selectedRowKeys, 'selectedRows: ', selectedRows);
                this.setState({selectedRowKeys});
              },
              selectedRowKeys: this.state.selectedRowKeys,
            }}
          />
        </div>
      </div>
    );
  }
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      loading: false,
      pageSize: 10,
      total: 0,
      current: 1,

      addVisible: false,
      eventType: '添加',
      editData: {},
      confirmLoading: false,

      morevisible: false,

      selectedRowKeys: [],
    };
    this.columns =[{
      title: 'VIN',
      dataIndex: 'vin',
    }, {
      title: '车型',
      dataIndex: 'type_name',
    }, {
      title: '生产日期',
      dataIndex: 'produce_time',
    }, {
      title: '车辆状态',
      dataIndex: 'status',
      render: (text) => ({0: '未录入', 1: '审核中', 2: '审核不通过', 3: '待入库', 4: '待销售', 5: '已销售', }[text]),
    }, {
      title: '操作',
      render: (text, record) => <span>
        {/* <a onClick={() => {
          this.setState({morevisible: true, eventType: '修改', editData: record});
        }}>详情</a>
        <span className="ant-divider" /> */}
        {/* <a onClick={() => {
          this.setState({addVisible: true, eventType: '修改', editData: record});
        }}>修改</a>
        <span className="ant-divider" /> */}
        <Popconfirm title="确定要删除?" onConfirm={this.doDel.bind(null, record.id)}>
          <a>删除</a>
        </Popconfirm>
      </span>,
    }];
  }
  query = (current, pageSize) => {
    this.setState({loading: true});
    // axios({url: '/api/deviceMag'}).then(v => {
    //   this.setState({
    //     data: v.data.data,
    //     loading: false
    //   });
    // });
    Axios({
      url: url_getGroupCar, 
      data: {
        groupId: this.props.id,
        pageSize: pageSize,
        pageIndex: current,
        orderBy: '',
        desc: '',
      }
    }).then(res => {
      this.setState((prevState, props) => ({
        data: res ? res.data : [],
        total: res.tols,
        pageSize,
        current,
        loading: false,
      }));
    });
  }
  handleTableChange = (pagination) => {
    this.query(pagination.current, pagination.pageSize);
  }
  doDel = id => {
    this.setState({loading: true});
    Axios({
      url: url_delGroupCar,
      data: {
        id,
        groupId: this.props.id,
      }
    }).then(res => {
      if(res) {
        message.success("删除成功");
        this.query(this.state.current, this.state.pageSize);
        this.setState({selectedRowKeys: []});
      }else {
        message.error("删除失败！");  
        this.setState({loading: false});
      }  
    });
  }
  doDels = () => {
    this.setState({loading: true});
    Axios({
      url: url_delGroupCar,
      data: {
        id: this.state.selectedRowKeys.toString(),
        groupId: this.props.id,
      }
    }).then(res => {
      if(res) {
        message.success("删除成功");
        this.query(this.state.current, this.state.pageSize);
        this.setState({selectedRowKeys: []});
      }else {
        message.error("删除失败！");  
        this.setState({loading: false});
      }  
    });
  }
  componentDidMount() {
    this.query(1, 10);
  }
}

export default groupItemListMag;