import React, { Component } from 'react';
import { Table, Row, Col, Input, Button, Modal, Select, Popconfirm, message, Tag, Tree } from 'antd';
import axios from 'axios';
import { connect } from 'react-redux';

import '../layout/style.less';
import { Axios } from '../../interface';
import { url_getRole, url_postRole, url_putRole, url_delRole, url_getRoleRight, url_putRoleRight } from '../../utils/config/api';
import { StandModal, MoreModal } from '../../components'
import { getSelectOrg, Init_SelectRole } from '../../actions';

const {Option} = Select;
const {TreeNode} = Tree;
const ColProps = {
  xl: 4,
  lg: 6,
  md: 8,
  sm: 12,
  xs: 24,
  style: {
    marginBottom: 16,
  },
};
class partMag extends Component {
  render() {
    return (
      <div className="sysMag">
        <div className="search-form">
          <Row gutter={24}>
            <Col  {...ColProps}>
              <Input placeholder="角色名称" onChange={e => this.queryForm.roleName = e.target.value}/>
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
              //showTotal: (total, range) => `${range[0]}-${range[1]} 共${total}`,
              showTotal: (total, range) => range[0] + "-" + range[1] + " 共" + total,
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
            {label: '角色名称', type: <Input />, key: 'roleName', init: this.getEditItem('role_name')}, 
            {label: '组织机构', type: 
              <Select style={{width: '100%'}}>
                {
                  this.props.selectOrg.map((v, i) => <Option value={v.id} key={v.id}>{v.org_name}</Option>)
                }
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
            {label: '角色名', init: this.getEditItem('role_name')}, 
            {label: 'id', init: this.getEditItem('id')}, 
            {label: '组织编号', init: this.getEditItem('org_id')},
            {label: '组织名称', init: this.getEditItem('org_name')},
            {label: '系统编号', init: this.getEditItem('sys_id')},
            {label: '系统名称', init: this.getEditItem('sys_name')},
            {label: '是否可用', init: {1: '可用', 0: '不可用'}[this.getEditItem('is_use')]},
            {label: '创建人', init: this.getEditItem('creator')},
            {label: '创建时间', init: this.getEditItem('create_time')},
            {label: '修改人', init: this.getEditItem('editor')},
            {label: '修改时间', init: this.getEditItem('edit_time')},
            {label: '备注', init: this.getEditItem('remark')},
          ]}
        </MoreModal>
        <Modal
          title="权限管理"
          visible={this.state.ruleMagVisible}
          onCancel={() => this.setState({ruleMagVisible: false})}
          onOk={this.onRuleOk}
          maskClosable={false}
          confirmLoading={this.state.ruleConfirmLoading}
          key={this.state.ruleMagVisible + '1'}
          className="standModalChangeColor"
        >
          <Tree className=""
            checkable
            //defaultExpandedKeys={this.state.defaultExpandedKeys}
            defaultCheckedKeys={this.state.defaultCheckedKeys}
            onCheck={this.onCheck}
          >
            { this.getTreeNode(this.state.ruleData) }
          </Tree>
        </Modal>
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

      ruleMagVisible: false,
      ruleMagRoleId: '',
      defaultCheckedKeys: [],
      checkedObj: [],
      defaultExpandedKeys: [],
      ruleData: [],
      ruleConfirmLoading: false,
      roleId: '',
    };
    this.queryForm= {
      roleName: '',
    };
    this.columns =[{
      title: '角色名称',
      dataIndex: 'role_name',
    }, {
      title: '系统中文名称',
      dataIndex: 'sys_name',
    }, {
      title: '组织机构',
      dataIndex: 'org_name',
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
        {this.props.ruleList.bindRule ? <span>
          <span className="ant-divider" />
          <a onClick={this.ruleClick.bind(null, record)}>权限绑定</a>
        </span> : ''}
      </span>,
    }];
  };
  ruleClick = async (record) => {
    this.setState({loading: true});
    const res = await Axios({
      url: url_getRoleRight,
      data: {
        roleId: record.id,
      }
    });
    if(res) {
      let defaultCheckedKeys = [];
      let defaultExpandedKeys = [];
      let checkedObj = [];
      const getDefaultCheckedKeys = children => {
        children.map((v, i) => {
          defaultExpandedKeys = [...defaultExpandedKeys, v.id];
          checkedObj = [...checkedObj, {rightId: v.id, isUse: v.is_use}];
          v.is_use && !(v.children && v.children.length > 0) ? defaultCheckedKeys = [...defaultCheckedKeys, v.id] : '';
          v.children && v.children.length > 0 ? getDefaultCheckedKeys(v.children) : ''
        });
      };
      getDefaultCheckedKeys(res.data);

      this.setState({ruleMagVisible: true, defaultExpandedKeys, defaultCheckedKeys, ruleData: res.data, checkedObj, roleId: record.id});
    } else {}
    this.setState({loading: false});
  }
  getTreeNode = (children) => {
    return children.map((v, i) => {
      return <TreeNode title={v.menu_name} key={v.id}>
        {
          v.children && v.children.length > 0 ? this.getTreeNode(v.children) : ''
        }
        </TreeNode>
    });
  }
  onCheck = (checkedKeys, info) => {
    console.log(checkedKeys);
    let checkedObj = this.state.checkedObj;
    if(checkedKeys.length === 0) {
      checkedObj.map((v, i) => checkedObj[i].isUse = 0);
    } else {
      for(let i = 0; i < checkedObj.length; i++) {
        for(let j = 0; j < checkedKeys.length; j++) {
          if(checkedObj[i].rightId === checkedKeys[j]) {
            checkedObj[i].isUse = 1;
            break;
          } else if(j === checkedKeys.length - 1) {
            checkedObj[i].isUse = 0;
          }
        }
      }
    }
  }
  onRuleOk = async () => {
    this.setState({ruleConfirmLoading: true});
    const checkedObj = this.state.checkedObj;
    console.log(checkedObj);
    const res = await Axios({url: url_putRoleRight, data: {roleId: this.state.roleId, right: checkedObj}});
    if(res) {
      this.setState({ruleMagVisible: false});
      message.success("保存成功！");
    } else {
      message.warning("保存失败！");
    }
    this.setState({ruleConfirmLoading: false});
  }
  query = (current, pageSize) => {
    this.setState({loading: true});
    Axios({
      url: url_getRole, 
      data: {
        id: '',
        roleName: this.queryForm.roleName,
        pageSize: pageSize,
        pageIndex: current,
        orderBy: '',
        desc: '',
      },
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
      res = await Axios({
        url: url_postRole,
        data: v
      })
    }else if(this.state.eventType === '修改') {
      const vWithId = v;
      vWithId.id = this.state.editData.id;
      res = await Axios({
        url: url_putRole,
        data: vWithId,
      })
    }
    if(res){
      message.success(`${this.state.eventType}成功`);
      this.setState({addVisible: false});
      this.query(this.state.current, this.state.pageSize);
      this.props.dispatch({type: Init_SelectRole, info: []});
    }else {
      message.error(`${this.state.eventType}失败`);
    }
    this.setState({confirmLoading: false});
  }
  getEditItem = itemText => this.state.eventType === '添加' ? '' : this.state.editData[itemText];
  doDel = id => {
    this.setState({loading: true});
    Axios({
      url: url_delRole,
      data: {id,}
    }).then(res => {
      if(res) {
        message.success("删除成功");
        this.query(this.state.current, this.state.pageSize);
        this.props.dispatch({type: Init_SelectRole, info: []});
      }else {
        message.error("删除失败！");  
        this.setState({loading: false});
      }  
    });
  }
  componentDidMount() {
    //获取组织机构下拉
    const dispatch = this.props.dispatch;
    dispatch(getSelectOrg());
  }
}

export default connect((state, props) => {
  const urlArr = props.match.url.split('/');
  return {
    selectOrg: state.selectOrg,
    userInfo: state.userInfo,
    ruleList: state.userInfo.buttonRulesV2 && state.userInfo.buttonRulesV2[urlArr[urlArr.length - 1]] || {},
  };
})(partMag);
// export default partMag;