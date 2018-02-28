import React, { Component } from 'react';
import { Table, Row, Col, Input, Button, Modal, Select, Popconfirm, message, DatePicker, Spin } from 'antd';
import axios from 'axios';


import '../layout/style.less';
import { Axios } from '../../interface';
import { url_getLog, url_getLogDetail, url_postLog } from '../../utils/config/api';
import { StandModal, MoreModal } from '../../components';

const {Option} = Select;
const {RangePicker} = DatePicker;
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
class ruleMag extends Component {
  render() {
    return (
      <div className="sysMag">
        <div className="search-form">
          <Row gutter={24}>
            <Col {...ColProps}>
              <Select placeholder="类型" style={{width: "100%"}} onChange={e => this.data.type = e}>
                <Option value="">类型</Option>
                <Option value="0">登录</Option>
                <Option value="1">登出</Option>
                <Option value="2">修改</Option>
                <Option value="3">删除</Option>
                <Option value="4">下载</Option>
                <Option value="5">控制</Option>
                <Option value="6">消息推送</Option>
                <Option value="7">报警</Option>
                <Option value="8">控制参数下发</Option>
                <Option value="8">异常</Option>
              </Select>
            </Col>
            <Col  {...ColProps}>
              <RangePicker showTime style={{width: "100%"}} format="YYYY-MM-DD HH:mm:ss" onChange={e => 
                e.length === 0 ? this.data.timeRange = [] : this.data.timeRange = [e[0].format("YYYY-MM-DD HH:mm:ss"), e[1].format("YYYY-MM-DD HH:mm:ss")]}/>
            </Col>
            <Col  {...ColProps} className="queryBtnGroup">
              <Button type="primary" icon="search" onClick={this.query.bind(null, 1, 10)}>查询</Button> 
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
          />
        </div>
        <MoreModal title={this.state.moreTitle} visible={this.state.morevisible}
          onCancel={() => this.setState({morevisible: false})}
        >
          {this.state.moreData}
        </MoreModal>
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
      moreData: [],
      moreTitle: '详情',
    };
    this.data = {
      type: '',
      timeRange: [],
    }
    this.columns =[{
      title: '操作',
      dataIndex: 'log_con',
    }, {
      title: '组织名称',
      dataIndex: 'org_name',
    }, {
      title: 'ip',
      dataIndex: 'user_ip',
    }, {
      title: '时间',
      dataIndex: 'create_time',
    }, {
      title: '账号',
      dataIndex: 'account',
    }, {
      title: '手机',
      dataIndex: 'phone',
    }, {
      title: 'vin',
      dataIndex: 'vin',
    }, {
      title: '操作',
      render: (text, record) => 
        <span>
          {record.operate_type === 2 || record.operate_type === 3 ? <a onClick={this.doMore.bind(null, record)}>详情</a> : '暂无'};
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
      url: url_getLog, 
      data: {
        id: '',
        operateType: this.data.type,
        startTime: this.data.timeRange[0] || '',
        endTime: this.data.timeRange[1] || '',
        pageSize: pageSize,
        pageIndex: current,
        orderBy: 'create_time',
        desc: 'desc',
      }
    }).then(res => {
      this.setState((prevState, props) => ({
        data: res ? res.data : [],
        total: res.tols,
        pageSize,
        current,
      }));
      this.setState({loading: false,});
    });
  }
  handleTableChange = (pagination) => {
    this.query(pagination.current, pagination.pageSize);
  }
  onOK = async (v) => {
    console.log(v);
    this.setState({confirmLoading: true});
    let res;
    if(this.state.eventType === '添加') {
      res = await Axios({
        url: url_postLog,
        data: v
      })
    }
    // else if(this.state.eventType === '修改') {
    //   const vWithId = v;
    //   vWithId.id = this.state.editData.id;
    //   res = await Axios({
    //     url: url_putSys,
    //     data: vWithId,
    //   })
    // }
    if(res){
      message.success(`${this.state.eventType}成功`);
      this.setState({addVisible: false});
      this.query(this.state.current, this.state.pageSize);
    }else {
      message.error(`${this.state.eventType}失败`);
    }
    this.setState({confirmLoading: false});
  }
  getEditItem = itemText => this.state.eventType === '添加' ? '' : this.state.editData[itemText];
  doMore = record => {
    this.setState({loading: true});
    Axios({
      url: url_getLogDetail,
      data: {
        logId: record.id,
      }
    }).then(res => {
      if(res) {
        let arr = [];
        res.data.forEach((v, i) => {
          arr.push({label: v.field_name + '旧值', init: v.old_val});
          arr.push({label: v.field_name + '新值', init: v.new_val});
        });
        this.setState({moreData: arr, morevisible: true, moreTitle: res.data[0].module_name});
      }
      this.setState({loading: false});
    });
  }
}

export default ruleMag;