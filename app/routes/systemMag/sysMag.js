import React, { Component } from 'react';
import { Table, Row, Col, Input, Button, Modal, Select, Popconfirm, message } from 'antd';
import axios from 'axios';

import '../layout/style.less';
import { Axios } from '../../interface';
import { url_getSys, url_postSys, url_putSys, url_delSys, } from '../../utils/config/api';
import { StandModal, MoreModal } from '../../components'
import {connect} from 'react-redux';
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
class sysMag extends Component {
  render() {
    return (
      <div className="sysMag">
        <div className="search-form">
          <Row gutter={24}>
            <Col  {...ColProps} className="queryBtnGroup">
              <Button type="primary" icon="search" onClick={this.query.bind(null, 1, 10)}>查询</Button> 
              {this.props.ruleList.addRule ? <Button type="primary" icon="plus" onClick={
                () => this.setState({addVisible: true, eventType: '添加'})}
              >添加</Button> : ''}
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
        <StandModal title={this.state.eventType} visible={this.state.addVisible}
          onOk={this.onOK}
          onCancel={() => this.setState({addVisible: false})}
          style={{top: 30}}
          confirmLoading={this.state.confirmLoading}
          key={this.state.addVisible}
        >
          {[
            {label: '系统英文编码', type: <Input />, key: 'sysCode', init: this.getEditItem('sys_code')}, 
            {label: '系统中文名称', type: <Input />, key: 'sysName', init: this.getEditItem('sys_name')}, 
            {label: '内网IP', type: <Input />, key: 'innerRequestUrl', init: this.getEditItem('inner_request_url')}, 
            {label: '外网IP', type: <Input />, key: 'webRequestUrl', init: this.getEditItem('web_request_url')}, 
            {label: '外网域名', type: <Input />, key: 'webScope', init: this.getEditItem('web_scope')}, 
            {label: '系统类型', type: 
              <Select style={{width: '100%'}}>
                <Option value={0}>web</Option>
                <Option value={1}>app</Option>
                <Option value={2}>ios</Option>
              </Select>, key: 'sysType', init: this.getEditItem('sys_type')}, 
            {label: '系统版本', type: <Input />, key: 'sysVersion', init: this.getEditItem('sys_version')}, 
            //{label: 'key', type: <Input />, key: 'indentifyKey', init: this.getEditItem('indentify_key')}, 
            //{label: '校检密码', type: <Input />, key: 'indentifySecret', init: this.getEditItem('indentify_secret')}, 
            {label: '所属组织', type: <Select style={{width: '100%'}}>
              {this.props.selectOrg.map((v, i) => <Option value={v.id}>{v.org_name}</Option>)}
            </Select>, key: 'orgId', init: this.getEditItem('org_id')}, 
            {label: '是否可用', type: 
              <Select style={{width: '100%'}}>
                <Option value={0}>禁用</Option>
                <Option value={1}>启用</Option>
              </Select>, key: 'isUse', init: this.getEditItem('is_use') === '' ? 1 : this.getEditItem('is_use')}, 
          ]}
        </StandModal>
        <MoreModal title="详情" visible={this.state.morevisible}
          onCancel={() => this.setState({morevisible: false})}
        >
          {[
            {label: '系统英文编码', init: this.getEditItem('sys_code')}, 
            {label: '系统中文名称', init: this.getEditItem('sys_name')}, 
            {label: '内网IP', init: this.getEditItem('inner_request_url')},
            {label: '外网IP', init: this.getEditItem('web_request_url')},
            {label: '外网域名', init: this.getEditItem('web_scope')},
            {label: '系统类型', init: {0: 'web', 1: 'app', 2: 'ios'}[this.getEditItem('sys_type')]},
            {label: '系统版本', init: this.getEditItem('sys_version')},
            {label: 'key', init: this.getEditItem('indentify_key')},
            {label: '校检密码', init: this.getEditItem('indentify_secret')},
            {label: '所属组织编号', init: this.getEditItem('org_id')},
            {label: '是否可用', init: {1: '可用', 0: '不可用'}[this.getEditItem('is_use')]},
            {label: '创建人', init: this.getEditItem('creator')},
            {label: '创建时间', init: this.getEditItem('create_time')},
            {label: '修改人', init: this.getEditItem('editor')},
            {label: '修改时间', init: this.getEditItem('edit_time')},
          ]}
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
    };
    this.columns =[{
      title: '系统中文名称',
      dataIndex: 'sys_name',
    }, {
      title: '系统类型',
      dataIndex: 'sys_type',
      render: (text, record) => ({0: 'web', 1: 'app', 2: 'ios'}[record.sys_type]),
    }, {
      title: '系统版本',
      dataIndex: 'sys_version',
    }, {
      title: '操作',
      render: (text, record) => <span>
        <a onClick={() => {
          this.setState({morevisible: true, eventType: '修改', editData: record});
        }}>详情</a>
        {this.props.ruleList.editRule ? <span>
          <span className="ant-divider" />
          <a onClick={() => {
            this.setState({addVisible: true, eventType: '修改', editData: record});
          }}>修改</a>
        </span> : ''}
        {this.props.ruleList.delRule ? <span>
          <span className="ant-divider" />
          <Popconfirm title="确定要删除?" onConfirm={this.doDel.bind(null, record.id)}>
            <a>删除</a>
          </Popconfirm>
        </span> : ''}
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
      url: url_getSys, 
      data: {
        id: '',
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
  onOK = async (v) => {
    console.log(v);
    this.setState({confirmLoading: true});
    let res;
    if(this.state.eventType === '添加') {
      res = await Axios({
        url: url_postSys,
        data: v
      })
    }else if(this.state.eventType === '修改') {
      const vWithId = v;
      vWithId.id = this.state.editData.id;
      res = await Axios({
        url: url_putSys,
        data: vWithId,
      })
    }
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
  doDel = id => {
    this.setState({loading: true});
    Axios({
      url: url_delSys,
      data: {
        id,
      }
    }).then(res => {
      if(res) {
        message.success("删除成功");
        this.query(this.state.current, this.state.pageSize);
      }else {
        message.error("删除失败！");  
        this.setState({loading: false});
      }  
    });
  }
  componentDidMount() {
    this.query(1, 10);
    this.props.dispatch(getSelectOrg());
  }
}

export default connect((state, props) => {
  const urlArr = props.match.url.split('/');
  return {
    selectOrg: state.selectOrg, 
    userInfo: state.userInfo,
    ruleList: state.userInfo.buttonRulesV2 && state.userInfo.buttonRulesV2[urlArr[urlArr.length - 1]] || {},
  }
})(sysMag);