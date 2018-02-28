import React, { Component } from 'react';
import { Table, Row, Col, Input, Button, Modal, Select, Popconfirm, message } from 'antd';
import axios from 'axios';
import {connect} from 'react-redux';

import '../layout/style.less';
import { Axios } from '../../interface';
import { url_getParam, url_postParam, url_putParam, url_delParam } from '../../utils/config/api';
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
class sysMag extends Component {
  render() {
    return (
      <div className="sysMag">
        <div className="search-form">
          <Row gutter={24}>
            <Col  {...ColProps}>
              <Input placeholder="参数名称" onChange={e => this.data.paramName = e.target.value}/>
            </Col>
            <Col  {...ColProps} className="queryBtnGroup">
              <Button type="primary" icon="search" onClick={this.query.bind(null, 1, 10)}>查询</Button> 
              {this.props.ruleList.addRule ? <Button type="primary" icon="plus" onClick={
                () => this.setState({addVisible: true, eventType: '添加'})}>添加</Button> : ''}
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
            {label: '编号', type: <Input />, key: 'parmCode', init: this.getEditItem('parm_code')}, 
            {label: '类型', type: <Input />, key: 'parmType', init: this.getEditItem('parm_type')}, 
            {label: '名称', type: <Input />, key: 'parmName', init: this.getEditItem('parm_name')}, 
            {label: '值', type: <Input />, key: 'parmValue', init: this.getEditItem('parm_value')}, 
            {label: '顺序', type: <Input />, key: 'parmIndex', init: this.getEditItem('parm_index')}, 
            {label: '描述', type: <Input />, key: 'parmDesc', init: this.getEditItem('parm_desc')}, 
            {label: '是否是根节点', type: 
              <Select style={{width: '100%'}}>
                <Option value={0}>否</Option>
                <Option value={1}>是</Option>
              </Select>, key: 'isRoot', init: this.getEditItem('is_root')}, 
            {label: '父编号', type: <Input />, key: 'parentCode', init: this.getEditItem('parent_code')}, 
          ]}
        </StandModal>
        <MoreModal title="详情" visible={this.state.morevisible}
          onCancel={() => this.setState({morevisible: false})}
        >
          {[
            {label: '编号', init: this.getEditItem('parm_type')}, 
            {label: '类型', init: this.getEditItem('parm_type')}, 
            {label: '名称', init: this.getEditItem('parm_name')},
            {label: '值', init: this.getEditItem('parm_value')},
            {label: '顺序', init: this.getEditItem('parm_index')},
            {label: '描述', init: this.getEditItem('parm_desc')},
            {label: '是否是根节点', init: this.getEditItem('is_root')},
            {label: '父编号', init: this.getEditItem('parent_code')},
            {label: '创建人', init: this.getEditItem('creator')},
            {label: '创建时间', init: this.getEditItem('create_time')},
            {label: '修改人', init: this.getEditItem('editor')},
            {label: '修改时间', init: this.getEditItem('edit_time')},
            {label: '备注', init: this.getEditItem('remark')},
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
    this.data = {
      paramName: '',
    }
    this.columns =[{
      title: '编号',
      dataIndex: 'parm_code',
    }, {
      title: '类型',
      dataIndex: 'parm_type',
    }, {
      title: '名称',
      dataIndex: 'parm_name',
    }, {
      title: '值',
      dataIndex: 'parm_value',
    }, {
      title: '顺序',
      dataIndex: 'parm_index',
    }, {
      title: '描述',
      dataIndex: 'parm_desc',
    }, {
      title: '父编号',
      dataIndex: 'parent_code',
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
          <span className="ant-divider" />
        </span> : ''}
        {this.props.ruleList.delRule ? <Popconfirm title="确定要删除?" onConfirm={this.doDel.bind(null, record.id)}>
          <a>删除</a>
        </Popconfirm> : ''}
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
      url: url_getParam, 
      data: {
        id: '',
        paramName: this.data.paramName,
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
      }));
      // if(res) {
      //   this.setState({
      //     data: res ? res.data : [],
      //     total: res.tols,
      //     pageSize,
      //     current,
      //   });
      // }
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
        url: url_postParam,
        data: v
      })
    }else if(this.state.eventType === '修改') {
      const vWithId = v;
      vWithId.id = this.state.editData.id;
      res = await Axios({
        url: url_putParam,
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
      url: url_delParam,
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
  componentDidMount() {}
}

export default connect((state, props) => {
  const urlArr = props.match.url.split('/');
  return {
    userInfo: state.userInfo,
    ruleList: state.userInfo.buttonRulesV2 && state.userInfo.buttonRulesV2[urlArr[urlArr.length - 1]] || {},
  }
})(sysMag);