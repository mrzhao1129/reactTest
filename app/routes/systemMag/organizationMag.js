import React, { Component } from 'react';
import { Table, Row, Col, Input, Button, Modal, Select, DatePicker, Popconfirm, message, Upload, Icon, Tag, Tooltip  } from 'antd';
import axios from 'axios';
import {connect} from 'react-redux';

import '../layout/style.less';
import { Axios } from '../../interface';
import { url_getOrg, url_postOrg, url_putOrg, url_delOrg, } from '../../utils/config/api';
import { StandModal, MoreModal } from '../../components';
import { getSelectOrg, Init_SelectOrg } from '../../actions';

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
class organizationMag extends Component {
  render() {
    return (
      <div className="organizationMag">
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
              //showTotal: (total, range) => (`${range[0]}-${range[1]} 共${total}`),
              showTotal: (total, range) => (range[0] + '-' + range[1] + '共' + total),
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
          onCancel={() => this.setState({addVisible: false, fileList: []})}
          style={{top: 30}}
          confirmLoading={this.state.confirmLoading}
          key={this.state.addVisible}
        >
          {[
            {label: '组织编号', type: <Input />, key: 'orgCode', init: this.getEditItem('org_code'), rules: [
              {message: '2位大写字母或数字', required: true, validator: (r, v, c) => /^[A-Z|0-9]*$/g.test(v) && v.length === 2 ? c() : c(false)},
            ]}, 
            {label: '标准编码代码', type: <Input />, key: 'standardCode', init: this.getEditItem('standard_code')}, 
            {label: '组织英文缩写', type: <Input />, key: 'orgShort', init: this.getEditItem('org_short')},
            {label: '组织中文简称', type: <Input />, key: 'orgSimple', init: this.getEditItem('org_simple')},
            {label: '组织中文全称', type: <Input />, key: 'orgName', init: this.getEditItem('org_name')},
            {label: '组织类型', type: 
              <Select style={{width: '100%'}}>
                <Option value="0">车厂</Option>
                <Option value="1">个人</Option>
                <Option value="2">经销商</Option>
                <Option value="3">服务站</Option>
                <Option value="4">供应商</Option>
                <Option value="5">大客户</Option>
                <Option value="99">超级管理员</Option>
              </Select>, key: 'orgType', init: this.getEditItem('org_type')},
            {label: '父组织', type: <Select style={{width: '100%'}}>
              {this.props.selectOrg.map((v, i) => <Option value={v.id}>{v.org_name}</Option>)}
            </Select>, key: 'parentId', init: this.getEditItem('parent_id')},//下拉
            {label: '门户网址地址', type: <Input />, key: 'webUrl', init: this.getEditItem('web_url')},
            //{label: '机构图片路径', type: <Input />, key: 'imgUrl', init: this.getEditItem('img_url')},
            {label: '组织法人', type: <Input />, key: 'headMan', init: this.getEditItem('head_man')},
            {label: '联系人', type: <Input />, key: 'linkMan', init: this.getEditItem('link_man')},
            {label: '公司传真', type: <Input />, key: 'fax', init: this.getEditItem('fax')},
            {label: '联系人手机号', type: <Input />, key: 'mobile', init: this.getEditItem('mobile')},
            {label: '邮箱', type: <Input />, key: 'email', init: this.getEditItem('email')},
            {label: '邮政编码', type: <Input />, key: 'postCode', init: this.getEditItem('post_code')},
            //{label: '经度', type: <Input />, key: 'lng', init: this.getEditItem('lng')},
            //{label: '纬度', type: <Input />, key: 'lat', init: this.getEditItem('lat')},
            //{label: '行政区域代码', type: <Input />, key: 'areaCode', init: this.getEditItem('area_code')},
            {label: '组织所在地址', type: <Input />, key: 'orgAddress', init: this.getEditItem('org_address')},
            {label: '是否可用', type: 
              <Select style={{width: '100%'}}>
                <Option value={0}>禁用</Option>
                <Option value={1}>启用</Option>
              </Select>, key: 'isUse', init: this.getEditItem('is_use') === '' ? 1 : this.getEditItem('is_use')},
            {label: 'LOGO', type: 
              <Upload 
                accept="image/*"
                onRemove={(file) => {
                  this.setState(({ fileList }) => {
                    const index = fileList.indexOf(file);
                    const newFileList = fileList.slice();
                    newFileList.splice(index, 1);
                    return {
                      fileList: newFileList,
                    };
                  });
                }}
                beforeUpload={(file) => {
                  this.setState(({ fileList }) => ({
                    fileList: [...fileList, file],
                  }));
                  return false;
                }}
                fileList={this.state.fileList}
              >
                <Button disabled={this.state.fileList.length > 0}>
                  <Tooltip title="最佳显示比例186*50"><Icon type="upload" /> 选择文件</Tooltip>
                </Button>
              </Upload>, key: 'logoUrl', init: this.getEditItem('logo_url')},
          ]}
        </StandModal>
        <MoreModal title="详情" visible={this.state.morevisible}
          onCancel={() => this.setState({morevisible: false})}
        >
          {[
            {label: '组织编号', init: this.getEditItem('org_code')}, 
            {label: '标准编码代码', init: this.getEditItem('standard_code')}, 
            {label: '组织英文缩写', init: this.getEditItem('org_short')},
            {label: '组织中文简称', init: this.getEditItem('org_simple')},
            {label: '组织中文全称', init: this.getEditItem('org_name')},
            {label: '组织类型', init: {0: '车厂', 1: '个人', 2: '经销商', 3: '服务站', 4: '供应商', 5: '大客户', 99: '超级管理员' }[this.getEditItem('org_type')]},
            {label: '父组织编号', init: this.getEditItem('parent_id')},
            {label: '门户网址地址', init: this.getEditItem('web_url')},
            {label: 'logo图片路径', init: <a href={this.getEditItem('logo_url')} target="_blank">{this.getEditItem('logo_url')}</a>},
            {label: '机构图片路径', init: this.getEditItem('img_url')},
            {label: '组织法人', init: this.getEditItem('head_man')},
            {label: '联系人', init: this.getEditItem('link_man')},
            {label: '公司传真', init: this.getEditItem('fax')},
            {label: '联系人手机号', init: this.getEditItem('mobile')},
            {label: '邮箱', init: this.getEditItem('email')},
            {label: '邮政编码', init: this.getEditItem('post_code')},
            {label: '经度', init: this.getEditItem('lng')},
            {label: '纬度', init: this.getEditItem('lat')},
            {label: '行政区域代码', init: this.getEditItem('area_code')},
            {label: '组织所在地址', init: this.getEditItem('org_address')},
            {label: '是否可用', init: {1: '可用', 0: '不可用'}[this.getEditItem('is_use')]},
            {label: '扩展字段', init: this.getEditItem('extend_col')},
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
      fileList: [],//有文件需要

      morevisible: false,
    };
    this.columns =[{
      title: '组织中文全称',
      dataIndex: 'org_name',
    }, {
      title: '组织类型',
      dataIndex: 'org_type',
      render: (rexxt, record) => 
        ({0: '车厂', 1: '个人', 2: '经销商', 3: '服务站', 4: '供应商', 5: '大客户', 99: '超级管理员' }[record.org_type])
    }, {
      title: '组织法人',
      dataIndex: 'head_man',
    }, {
      title: '联系人',
      dataIndex: 'link_man',
    }, {
      title: '联系人手机号',
      dataIndex: 'mobile',
    }, {
      title: '启用',
      dataIndex: 'is_use',
      render: (text, record) => record.is_use ? <Tag color="green">是</Tag> : <Tag color="red">否</Tag>,
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
    Axios({
      url: url_getOrg, 
      data: {
        id: '',
        pageSize: pageSize,
        pageIndex: current,
        orderBy: 'create_time',
        desc: 'desc',
      }
    }).then(res => {
      if(res) {
        this.setState({
          data: res.data,
          total: res.tols,
          pageSize,
          current,
        });
      }
      this.setState({loading: false,});
    });
  }
  onOK = async (v, form) => {
    //[{originFileObj: this.state.fileList[this.state.fileList.length - 1]}]
    const files = this.state.fileList.length > 0 ? [{originFileObj: this.state.fileList[this.state.fileList.length - 1]}] : [];
    // const files = v.logoUrl.fileList || [];
    console.log(v);
    delete v.logoUrl;
    this.setState({confirmLoading: true});
    let res;
    if(this.state.eventType === '添加') {
      res = await Axios({
        url: url_postOrg,
        data: v,
        files,
        //headers: {'Content-Type': 'multipart/form-data'},
      })
    }else if(this.state.eventType === '修改') {
      let vWithId = v;
      vWithId.id = this.state.editData.id;
      res = await Axios({
        url: url_putOrg,
        data: vWithId,
        files,
      })
    }
    if(res){
      message.success(`${this.state.eventType}成功`);
      this.setState({addVisible: false});
      this.query(this.state.current, this.state.pageSize);
      this.props.dispatch({type: Init_SelectOrg, info: [],});
    }else {
      message.error(`${this.state.eventType}失败`);
    }
    this.setState({confirmLoading: false, fileList: []});
  }
  handleTableChange = (pagination) => {
    this.query(pagination.current, pagination.pageSize);
  }
  getEditItem = itemText => this.state.eventType === '添加' ? '' : this.state.editData[itemText]
  doDel = id => {
    this.setState({loading: true});
    Axios({
      url: url_delOrg,
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
})(organizationMag);