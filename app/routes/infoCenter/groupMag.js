import React, { Component } from 'react';
import { Table, Row, Col, Input, Button, Modal, Select, Popconfirm, message, Tree, Tag } from 'antd';
import axios from 'axios';
import { connect } from 'react-redux';

import '../layout/style.less';
import { Axios } from '../../interface';
import { url_getTreeGroup, url_getGroup, url_postGroup, url_putGroup, url_delGroup } from '../../utils/config/api';
import { StandModal, MoreModal } from '../../components'
import { getSelectOrg, Init_SelectGroup, getSelectGroup } from '../../actions';
import GroupItemMag from './groupItemMag';
import GroupItemLIstMag from './groupItemList';

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
}
class groupMag extends Component {
  render() {
    return (
      <div className="groupMag">
        <div className="search-form">
          <Row gutter={24}>
            <Col  {...ColProps}>
              <Select placeholder="车厂" style={{width: '100%'}} onChange={e => this.queryForm.orgId = e}>
                <Option value="">车厂</Option>
                {this.props.selectOrg.map((v, i) => <Option value={v.id} key={v.id}>{v.org_name}</Option>)}
              </Select>
            </Col>
            <Col  {...ColProps}>
              <Input placeholder="分组名称" onChange={e => this.queryForm.groupName = e.target.value}/>
            </Col>
            <Col  {...ColProps} className="queryBtnGroup">
              <Button type="primary" icon="search" onClick={this.query.bind(null, 1, 10)}>查询</Button> 
              {this.props.ruleList.addRule ? <Button type="primary" icon="plus" onClick={
                () => this.setState({addVisible: true, eventType: '添加'})}>添加</Button> : '' }
              <Button type="primary" onClick={this.treeOnClick} loading={this.state.treeLoading}>树形图</Button>
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
            {label: '分组名称', type: <Input />, key: 'groupName', init: this.getEditItem('group_name')}, 
            {label: '分组等级', type: <Input />, key: 'groupLevel', init: this.getEditItem('group_level')}, 
            {label: '顺序', type: <Input />, key: 'orderBy', init: this.getEditItem('order_by')}, 
            {label: '父分组', type: <Select style={{width: '100%'}}>
              {this.props.selectGroup.map((v, i) => <Option value={v.id} key={v.id}>{v.text}</Option>)}
            </Select>, key: 'parentId', init: this.getEditItem('parent_id')}, 
            {label: '分组类型', type: 
              <Select style={{width: "100%"}}>
                <Option value={0}>车厂</Option>
                <Option value={1}>经销商</Option>
                <Option value={2}>大客户</Option>
                <Option value={3}>个人</Option>
              </Select>, key: 'groupType', init: this.getEditItem('group_type')}, 
            //1709291601李工不需要//{label: '所属组织', type: <Input />, key: 'groupOrg', init: this.getEditItem('org_name')}, 
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
            {label: '分组名称', init: this.getEditItem('group_name')}, 
            {label: 'ID', init: this.getEditItem('id')}, 
            {label: '分组等级', init: this.getEditItem('group_level')}, 
            {label: '分组类型', init: {0: '车厂', 1: '经销商', 2: '大客户', 3: '个人'}[this.getEditItem('group_type')]}, 

            {label: '顺序', init: this.getEditItem('order_by')}, 
            {label: '车厂ID', init: this.getEditItem('org_id')}, 
            {label: '车厂', init: this.getEditItem('org_name')}, 
            {label: '父分组ID', init: this.getEditItem('"parent_id"')}, 
            {label: '账号', init: this.getEditItem('"account"')}, 
            
            {label: '是否可用', init: {1: '可用', 0: '不可用'}[this.getEditItem('is_use')]},
            {label: '创建人', init: this.getEditItem('creator')},
            {label: '创建时间', init: this.getEditItem('create_time')},
            {label: '修改人', init: this.getEditItem('editor')},
            {label: '修改时间', init: this.getEditItem('edit_time')},
            {label: '备注', init: this.getEditItem('remark')},
          ]}
        </MoreModal>
        <Modal visible={this.state.treeVisible}
          onCancel={() => this.setState({treeVisible: false})}
          onOk={() => this.setState({treeVisible: false})}
          footer={null}
        >
          <Tree defaultExpandAll className="my-tree">
            {this.loopTree(this.state.treeData)}
            {/* <TreeNode title="parent 1" key="0-0">
              <TreeNode title="parent 1-0" key="0-0-0">
                <TreeNode title="leaf" key="0-0-0-0" />
                <TreeNode title="leaf" key="0-0-0-1" />
              </TreeNode>
              <TreeNode title="parent 1-1" key="0-0-1">
                <TreeNode title={<span style={{ color: '#08c' }}>sss</span>} key="0-0-1-0" />
              </TreeNode>
            </TreeNode> */}
          </Tree>
        </Modal>
        <Modal visible={this.state.groupItemsVisible}
          width="95%"
          footer={null}
          onCancel={() => this.setState({groupItemsVisible: false})}
          maskClosable={false}
          key={Math.random()}><GroupItemMag id={this.state.groupItemsId}/></Modal>
        <Modal visible={this.state.groupItemsListVisible}
          width="95%"
          footer={null}
          onCancel={() => this.setState({groupItemsListVisible: false})}
          maskClosable={false}
          key={Math.random()}><GroupItemLIstMag id={this.state.groupItemsId}/></Modal>
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
      treeVisible: false,
      treeData: [],
      treeLoading: false,

      groupItemsVisible: false,
      groupItemsId: '',
      groupItemsListVisible: false,
    };
    this.queryForm = {
      orgId: '',
      groupName: '',
    }
    this.columns =[{
      title: '分组名称',
      dataIndex: 'group_name',
    }, {
      title: '分组等级',
      dataIndex: 'group_level',
    }, {
      title: '分组类型',
      dataIndex: 'group_type',
      render: (text, record) => ({0: '车厂', 1: '经销商', 2: '大客户', 3: '个人'}[record.group_type])
    }, {
      title: '车厂',
      dataIndex: 'org_name',
    }, {
      title: '顺序',
      dataIndex: 'order_by',
    }, {
      title: '父分组',
      dataIndex: 'parent_name',
    }, {
      title: '启用',
      dataIndex: 'is_use',
      render: (text, record) => record.is_use ? <Tag color="green">是</Tag> : <Tag color="red">否</Tag>,
    }, {
      title: '车辆数目',
      dataIndex: 'car_num',
    }, {
      title: '车辆列表',
      render: (text, record) => <span><a onClick={() => this.setState({groupItemsListVisible: true, groupItemsId: record.id})}>列表</a></span>,
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
          <a onClick={() => this.setState({groupItemsVisible: true, groupItemsId: record.id})}>车辆分组</a>
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
      url: url_getGroup, 
      data: {
        id: '',
        orgId: this.queryForm.orgId,
        groupName: this.queryForm.groupName,
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
        url: url_postGroup,
        data: v
      })
    }else if(this.state.eventType === '修改') {
      const vWithId = v;
      vWithId.id = this.state.editData.id;
      res = await Axios({
        url: url_putGroup,
        data: vWithId,
      })
    }
    if(res){
      message.success(`${this.state.eventType}成功`);
      this.setState({addVisible: false});
      this.query(this.state.current, this.state.pageSize);
      this.props.dispatch({type: Init_SelectGroup, info: []});
      this.props.dispatch(getSelectGroup());
    }else {
      message.error(`${this.state.eventType}失败`);
    }
    this.setState({confirmLoading: false});
  }
  getEditItem = itemText => this.state.eventType === '添加' ? '' : this.state.editData[itemText];
  doDel = id => {
    this.setState({loading: true});
    Axios({
      url: url_delGroup,
      data: {
        id,
      }
    }).then(res => {
      if(res) {
        message.success("删除成功");
        this.query(this.state.current, this.state.pageSize);
        this.props.dispatch({type: Init_SelectGroup, info: []});
        this.props.dispatch(getSelectGroup());
      }else {
        message.error("删除失败！");  
        this.setState({loading: false});
      }
    });
  }
  treeOnClick = async () => {
    this.setState({treeLoading: true});
    const res = await Axios({
      url: url_getTreeGroup,
    })
    if(res){
      this.setState({treeData: res.data, treeVisible: true});
    } else {
      this.setState({treeData: []});
    }
    this.setState({treeLoading: false});
  }
  loopTree = (children) => {
    return children.map((v, i) => <TreeNode title={v.text} key={v.id}>
    {
      v.children.length > 0 ? this.loopTree(v.children) : ''
    }
    </TreeNode>)
  }
    
  componentDidMount() {
    this.props.dispatch(getSelectOrg());
    this.props.dispatch(getSelectGroup());
  }
}

export default connect((state, props) => {
  const urlArr = props.match.url.split('/');
  return {
    selectOrg: state.selectOrg,
    selectGroup: state.selectObj.selectGroup,
    ruleList: state.userInfo.buttonRulesV2 && state.userInfo.buttonRulesV2[urlArr[urlArr.length - 1]] || {},
  }
})(groupMag);