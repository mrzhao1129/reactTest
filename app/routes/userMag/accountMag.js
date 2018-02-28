import React, { Component } from 'react';
import { Table, Row, Col, Input, Button, Modal, Select, Popconfirm, message } from 'antd';
import axios from 'axios';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import '../layout/style.less';
import { Axios } from '../../interface';
import { url_getUser, url_postUser, url_putUser, url_delUser, url_getPubKey, getPubKeyCode, url_getMenuRole } from '../../utils/config/api';
import { StandModal, MoreModal } from '../../components'
import JSEncrypt from '../../utils/js/jsencrypt.min';
import { getSelectOrg, getSelectRole, getSelectGroup } from '../../actions';

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
class accountMag extends Component {
  render() {
    return (
      <div className="sysMag">
        <div className="search-form">
          <Row gutter={24}>
            <Col  {...ColProps}>
              <Input placeholder="用户名称" onChange={e => this.queryForm.name = e.target.value}/>
            </Col>
            <Col  {...ColProps}>
              <Input placeholder="账号" onChange={e => this.queryForm.account = e.target.value}/>
            </Col>
            <Col  {...ColProps}>
              <Input placeholder="手机号" onChange={e => this.queryForm.phone = e.target.value}/>
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
          onCancel={() => this.setState({addVisible: false, isGetRoleList: false})}
          style={{top: 30}}
          confirmLoading={this.state.confirmLoading}
          key={this.state.addVisible}
        >
          {[
            {label: '账号', type: <Input />, key: 'account', init: this.getEditItem('account'), rules: [{message: '必填项', required: true}]}, 
            {label: '简称', type: <Input />, key: 'nickName', init: this.getEditItem('nick_name')}, 
            {label: '名称', type: <Input />, key: 'name', init: this.getEditItem('name')}, 
            {label: '性别', type: 
              <Select style={{width: '100%'}}>
                <Option value={0}>女</Option>
                <Option value={1}>男</Option>
              </Select>, key: 'sex', init: this.getEditItem('sex')}, 
            //{label: '密码', type: <Input />, key: 'password'}, 
            {label: '用户类型', type: 
              <Select style={{width: '100%'}}>
                <Option value={0}>超级管理员</Option>
                <Option value={1}>车厂用户</Option>
                <Option value={2}>车主</Option>
                <Option value={3}>经销商</Option>
                <Option value={4}>电池供应商</Option>
                <Option value={5}>服务站</Option>
                <Option value={6}>大客户</Option>
                <Option value={7}>内部平台</Option>
                <Option value={8}>第三方平台</Option>
              </Select>, key: 'userType', init: this.getEditItem('user_type')}, 
            {label: '手机', type: <Input />, key: 'phone', init: this.getEditItem('phone'), rules: [{ message: '必填项', required: true }, {message: '长度应为11位', len: 11}]}, 
            {label: 'QQ', type: <Input />, key: 'qq', init: this.getEditItem('qq')}, 
            {label: '邮箱', type: <Input />, key: 'email', init: this.getEditItem('email')}, 
            {label: '是否是管理员', type: 
              <Select style={{width: '100%'}}>
                <Option value={0}>否</Option>
                <Option value={1}>是</Option>
              </Select>, key: 'isAdmin', init: this.getEditItem('is_admin') === '' ? 0 : this.getEditItem('is_admin')}, 
            {label: 'app权限', type: 
              <Select style={{width: '100%'}}>
                <Option value={0}>否</Option>
                <Option value={1}>是</Option>
              </Select>, key: 'isApp', init: this.getEditItem('is_app') === '' ? 0 : this.getEditItem('is_app')}, 
            {label: '是否使用', type: 
              <Select style={{width: '100%'}}>
                <Option value={0}>禁用</Option>
                <Option value={1}>启用</Option>
              </Select>, key: 'isUse', init: this.getEditItem('is_use') === '' ? 1 : this.getEditItem('is_use')}, 
            {label: '组织机构', type: 
              <Select style={{width: '100%'}} onChange={e => this.orgChangeToRole(e)}>
                {this.props.selectOrg.map((v, i) => <Option value={v.id} key={v.id}>{v.org_name}</Option>)}
              </Select>, key: 'orgId', init: this.getEditItem('org_id'), rules: [{message: '必填项', required: true}]}, 
            {label: '角色', type: 
              <Select style={{width: '100%'}}>
                {(this.state.isGetRoleList ? this.state.roleList : this.props.selectRole).map((v, i) => <Option value={v.id} key={v.id}>{v.role_name}</Option>)}
              </Select>, key: 'roleId', init: this.getEditItem('role_id')}, 
            {label: '分组', type: 
              <Select style={{width: '100%'}}>
                {this.props.selectGroup.map((v, i) => <Option value={v.id} key={v.id}>{v.text}</Option>)}
              </Select>, key: 'groupId', init: this.getEditItem('group_id')}, 
            {label: '其他', type: <Input />, key: 'remark', init: this.getEditItem('remark')}, 
          ]}
        </StandModal>
        <MoreModal title="详情" visible={this.state.morevisible}
          onCancel={() => this.setState({morevisible: false})}
        >
          {[
            {label: '账号', init: this.getEditItem('account')}, 
            {label: '地址', init: this.getEditItem('address')}, 
            {label: '生日', init: this.getEditItem('birthday')},
            {label: '邮箱', init: this.getEditItem('email')},
            {label: '爱好', init: this.getEditItem('hobby')},
            {label: '名称', init: this.getEditItem('name')},
            {label: '简称', init: this.getEditItem('nick_name')},
            {label: '职业', init: this.getEditItem('occupation')},
            {label: '手机号', init: this.getEditItem('phone')},
            {label: 'QQ', init: this.getEditItem('qq')},
            {label: '角色', init: this.getEditItem('role_name')},
            {label: '性别', init: {0: '女', 1: '男'}[this.getEditItem('sex')]},
            {label: 'id', init: this.getEditItem('id')},
            {label: '证件号码', init: this.getEditItem('id_number')},
            {label: '证件类型', init: this.getEditItem('id_type')},
            {label: '错误数量', init: this.getEditItem('error_count')},
            {label: '附加信息', init: this.getEditItem('extra_info')},
            {label: '分组', init: this.getEditItem('group_name')},
            {label: '是否是管理员', init: {0: '否', 1: '是'}[this.getEditItem('is_admin')]},
            {label: 'app权限', init: {0: '否', 1: '是'}[this.getEditItem('is_app')]},
            {label: '可用否', init: {0: '否', 1: '可用'}[this.getEditItem('is_use')]},
            {label: '锁定时间', init: this.getEditItem('lock_time')},
            {label: '组织名称', init: this.getEditItem('org_name')},
            {label: '系统名称', init: this.getEditItem('sys_name')},
            {label: '用户类型', init: {0: '超级管理员', 1: '车厂用户', 2: '车主', 3: '经销商', 4: '电池供应商', 5: '服务站', 6: '大客户', 7: '内部平台', 8: '第三方平台'}[this.getEditItem('user_type')]},
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
      roleList: [],
      isGetRoleList: false,
    };
    this.queryForm = {
      name: '',
      account: '',
      phone: '',
    };  
    this.columns =[{
      title: '账号',
      dataIndex: 'account',
    }, {
      title: '名称',
      dataIndex: 'name',
    }, {
      title: '分组',
      dataIndex: 'group_name',
    }, {
      title: '所属机构',
      dataIndex: 'org_name',
    }, {
      title: '角色名称',
      dataIndex: 'role_name',
    }, {
      title: '系统',
      dataIndex: 'sys_name',
    }, {
      title: '手机',
      dataIndex: 'phone',
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
  // getDefaultProps() {
  //   return {
  //     ruleList: {},
  //   }
  // }
  orgChangeToRole = async (orgId) => {
    const res = await Axios({
      url: url_getMenuRole,
      data: {
        orgId,
      }
    });
    this.setState(() => ({
      roleList: res ? res.data : [],
      isGetRoleList: true,
    }));
  }
  query = (current, pageSize) => {
    this.setState({loading: true});
    Axios({
      url: url_getUser, 
      data: {
        id: '',
        name: this.queryForm.name,
        account: this.queryForm.account,
        phone: this.queryForm.phone,
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
    this.setState({confirmLoading: true});
    let res;
    if(this.state.eventType === '添加') {
      const pubK = await Axios({url: url_getPubKey, code: getPubKeyCode, data: {},});
      if(pubK) {
        const pubKey = pubK.data[0].pubKey;
        //加密
        const encrypt = new JSEncrypt();
        encrypt.setPublicKey(pubKey);
        v.password = encrypt.encrypt('123456').replace(/\+/g, '%2B');
        res = await Axios({
          url: url_postUser,
          data: v
        })
      }else {
        message.error('获取公钥失败，请重试。');
        return false;
      }
    }else if(this.state.eventType === '修改') {
      const vWithId = v;
      vWithId.id = this.state.editData.id;
      res = await Axios({
        url: url_putUser,
        data: vWithId,
      })
    }
    if(res){
      message.success(`${this.state.eventType}成功`);
      this.setState({addVisible: false, isGetRoleList: false});
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
      url: url_delUser,
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
    const dispatch = this.props.dispatch;
    dispatch(getSelectOrg());
    dispatch(getSelectGroup());
    dispatch(getSelectRole());
  }
}
accountMag.defaultProps = {
  ruleList: {},
}
accountMag.propTypes = {
  selectOrg: PropTypes.object,
  selectGroup: PropTypes.array,
  selectRole: PropTypes.array,
  userInfo: PropTypes.object,
  ruleList: PropTypes.object,
}
export default connect((state, props) => {
  const urlArr = props.match.url.split('/');
  return {
    selectOrg: state.selectOrg,
    selectGroup: state.selectObj.selectGroup,
    selectRole: state.selectObj.selectRole,
    userInfo: state.userInfo,
    ruleList: state.userInfo.buttonRulesV2 && state.userInfo.buttonRulesV2[urlArr[urlArr.length - 1]] || {},
  };
})(accountMag);