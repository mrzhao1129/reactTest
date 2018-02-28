import React, { Component } from 'react';
import { Table, Row, Col, Input, Button, Modal, Select, DatePicker, Popconfirm, message, Tag, Icon } from 'antd';
import axios from 'axios';
import {connect} from 'react-redux';

import '../layout/style.less';
import { Axios } from '../../interface';
import { url_getMenu, url_getTreeMenu, url_postMenu, url_putMenu, url_delMenu } from '../../utils/config/api';
import { StandModal, MoreModal } from '../../components'

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
class menuMag extends Component {
  render() {
    return (
      <div className="menuMag">
        <div className="search-form">
          <Row gutter={24}>
            <Col  {...ColProps} className="queryBtnGroup">
              <Button type="primary" icon="search" onClick={this.query}>刷新</Button>
              {this.props.ruleList.addRule ? <Button type="primary" icon="plus" onClick={
                () => this.setState({addVisible: true, eventType: '添加', addData: {}})}
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
            pagination = {false}
            rowKey="id"//key
            bordered
            size="middle"
            //scroll={{x: 1250}}//宽度
            defaultExpandAllRows={true}
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
            {label: '菜单名称', type: <Input />, key: 'menuName', init: this.getEditItem('menu_name')}, 
            {label: '菜单类型', type: 
              <Select style={{width: '100%'}}>
                <Option value={0}>导航菜单</Option>
                <Option value={1}>界面模块</Option>
                <Option value={2}>操作功能</Option>
              </Select>, key: 'menuType', init: this.getEditItem('menu_type')}, 
            {label: '菜单图标标识', type: <Input />, key: 'picId', init: this.getEditItem('pic_id')}, 
            {label: '菜单路径', type: <Input />, key: 'menuUrl', init: this.getEditItem('menu_url')}, 
            {label: '父级菜单编号', type: <Input disabled/>, key: 'parentId', init: this.state.addData.parent_id || this.getEditItem('parent_id')}, 
            {label: '是否可用', type: 
              <Select style={{width: '100%'}}>
                <Option value={0}>禁用</Option>
                <Option value={1}>启用</Option>
              </Select>, key: 'isUse', init: this.getEditItem('is_use') === '' ? 1 : this.getEditItem('is_use')}, 
            {label: '层级', type: 
              <Select style={{width: '100%'}}>
                <Option value={0}>根目录</Option>
                <Option value={1}>第一层</Option>
                <Option value={2}>第二层</Option>
              </Select>, key: 'menuLevel', init: this.getEditItem('menu_level')}, 
            {label: '顺序', type: <Input />, key: 'orderBy', init: this.getEditItem('order_by')}, 
          ]}
        </StandModal>
      </div>
    );
  }
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      loading: false,

      addVisible: false,
      eventType: '添加',
      editData: {},
      confirmLoading: false,
      addData: {},
    };
    this.columns =[{
      title: '名称',
      dataIndex: 'menu_name',
    }, {
      title: '层级',
      dataIndex: 'menu_level',
      render: (text, record) => (<Tag color={{0: '#cccccc', 1: '#8c8c8c', 2: '#000000'}[record.menu_level]}>{{0: '根目录', 1: '第一层', 2: '第二层'}[record.menu_level]}</Tag>)
    }, {
      title: '类型',
      dataIndex: 'menu_type',
      render: (text, record) => (<Tag color={{0: '#8c8c8c', 1: '#8c8c8c', 2: 'rgb(16, 142, 233)'}[record.menu_type]}>{{0: '导航菜单', 1: '界面模块', 2: '操作功能'}[record.menu_type]}</Tag>)
    }, {
      title: 'URL',
      dataIndex: 'menu_url',
    }, {
      title: '图标',
      dataIndex: 'pic_id',
      render: (text, record) => <Icon type={record.pic_id} />
    }, {
      title: '启用',
      dataIndex: 'is_use',
      render: (text, record) => record.is_use ? <Tag color="green">是</Tag> : <Tag color="red">否</Tag>,
    }, {
      title: '顺序',
      dataIndex: 'order_by',
    }, {
      title: '操作',
      render: (text, record) => <span>
        {
          record.menu_type !== 2 && this.props.ruleList.addRule ? 
            (<span><a onClick={() => this.setState({
              addData: {
                parent_id: record.id, 
              },
              addVisible: true,
              eventType: '添加',
              editData: {},
            })}>添加子项</a><span className="ant-divider" /></span>) 
            : ''
        }
        {this.props.ruleList.editRule ? <span><a onClick={() => {
            this.setState({addVisible: true, eventType: '修改', editData: record});
          }}>修改</a>
          <span className="ant-divider" /></span> : ''}
        {this.props.ruleList.delRule ? <Popconfirm title="确定要删除?" onConfirm={this.doDel.bind(null, record.id)}>
            <a>删除</a>
          </Popconfirm> : ''}
      </span>,
    }];
  }
  query = () => {
    this.setState({loading: true});
    Axios({
      url: url_getTreeMenu,
      data: {}
    }).then(res => {
      if(res) {
        this.setState({
          data: res.data,
        });
      }
      this.setState({loading: false,});
    });
  }
  onOK = async (v) => {
    console.log(v);
    this.setState({confirmLoading: true});
    let res;
    if(this.state.eventType === '添加' || this.state.eventType === '添加子项') {
      res = await Axios({
        url: url_postMenu,
        data: v
      })
    }else if(this.state.eventType === '修改') {
      const vWithId = v;
      vWithId.id = this.state.editData.id;
      res = await Axios({
        url: url_putMenu,
        data: vWithId,
      })
    }
    if(res){
      const hehe = await message.success(`${this.state.eventType}成功`);
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
      url: url_delMenu,
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
    this.query();
  }
}

export default connect((state, props) => {
  const urlArr = props.match.url.split('/');
  return {
    userInfo: state.userInfo,
    ruleList: state.userInfo.buttonRulesV2 && state.userInfo.buttonRulesV2[urlArr[urlArr.length - 1]] || {},
  }
})(menuMag);