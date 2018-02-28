import React, { Component } from 'react';
import { Table, Row, Col, Input, Button, Modal, Select, Popconfirm, message, DatePicker, Tag } from 'antd';
import axios from 'axios';
import { connect } from 'react-redux';

import '../layout/style.less';
import { Axios } from '../../interface';
import { url_getTbox, url_getTboxToExcel } from '../../utils/config/api';
import { StandModal, MoreModal } from '../../components';
import { getSelectOrg } from '../../actions';

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
class deviceInfo extends Component {
  render() {
    return (
      <div className="sysMag">
        <div className="search-form">
          <Row gutter={24}>
            <Col  {...ColProps}>
              <RangePicker placeholder={['生产开始日期', '生产结束日期']} style={{width: '100%'}} showTime format="YYYY-MM-DD HH:mm:ss"
                onChange={e => {
                  if(e.length > 0) {
                    this.queryForm.startTime = e[0].format('YYYY-MM-DD HH:mm:ss');
                    this.queryForm.endTime = e[1].format('YYYY-MM-DD HH:mm:ss');
                  }else {
                    this.queryForm.startTime = '';
                    this.queryForm.endTime = '';
                  }
                }}
              /></Col>
            <Col  {...ColProps}><Input placeholder="终端编号" onChange={e => this.queryForm.tboxCode = e.target.value}/></Col>
            <Col  {...ColProps}>
              <Select placeholder="状态" onChange={''} style={{width: '100%'}} onChange={e => this.queryForm.state = e}>
                <Option value="">状态</Option>
                <Option value={0}>未绑定</Option>
                <Option value={1}>绑定</Option>
                <Option value={2}>更换</Option>
              </Select>
            </Col>
            <Col  {...ColProps}>
              <Select placeholder="固件版本" onChange={''} style={{width: '100%'}} onChange={e => this.queryForm.version = e}>
                <Option value="">固件版本</Option>
              </Select>
            </Col>
            <Col  {...ColProps}>
              <Select placeholder="车厂" onChange={''} style={{width: '100%'}} onChange={e => this.queryForm.orgId = e}>
                <Option value="">车厂</Option>
                {this.props.selectOrg.map((v, i) => <Option value={v.id}>{v.org_name}</Option>)}
              </Select>
            </Col>
            <Col  {...ColProps} className="queryBtnGroup">
              <Button type="primary" icon="search" onClick={this.query.bind(null, 1, 10)}>查询</Button> 
              {this.props.ruleList.expRule ? <Button type="primary" icon="download" 
                onClick={this.doExport} loading={this.state.exportLoading}>导出</Button> : ''}
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
        <MoreModal title="详情" visible={this.state.morevisible}
          onCancel={() => this.setState({morevisible: false})}
        >
          {[
            {label: 'ID', init: this.getEditItem('id')},
            {label: '终端号', init: this.getEditItem('tbox_code')},
            {label: 'iccid', init: this.getEditItem('iccid')},
            {label: '车厂ID', init: this.getEditItem('org_id')},
            {label: '车厂名称', init: this.getEditItem('org_name')},
            {label: '生产企业', init: this.getEditItem('pro_factory')},
            {label: '生产时间', init: this.getEditItem('register_time')},
            {label: '硬件版本', init: this.getEditItem('hand_version')},
            {label: '软件版本', init: this.getEditItem('version')},
            {label: '地址', init: this.getEditItem('address')}, 
            {label: '绑定时间', init: this.getEditItem('bind_time')}, 
            {label: '车型ID', init: this.getEditItem('car_type_id')},
            {label: 'SIM卡', init: this.getEditItem('sim')},
            {label: '状态', init: {0: '未绑定', 1: '绑定', 2: '更换'}[this.getEditItem('is_bind')]},
            {label: '在线否', init: this.getEditItem('on_line')},
            //{label: '是否可用', init: {1: '可用', 0: '不可用'}[this.getEditItem('is_use')]},
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
      exportLoading: false,

      eventType: '添加',
      editData: {},
      confirmLoading: false,

      morevisible: false,
    };
    this.queryForm = {
      tboxCode: '',
      startTime: '',
      endTime: '',
      state: '',
      version: '',
      orgId: '',
    };
    this.columns =[{
      title: '终端编号',
      dataIndex: 'tbox_code',
    }, {
      title: 'ICCID',
      dataIndex: 'iccid',
    }, {
      title: '车厂',
      dataIndex: 'org_name',
    }, {
      title: '生产日期',
      dataIndex: 'register_time',
    }, {
      title: '绑定车辆',
      dataIndex: 'vin',
    }, {
      title: '绑定日期',
      dataIndex: 'bind_time',
    }, {
      title: '固件版本',
      dataIndex: 'hand_version',
    }, {
      title: '当前状态',
      dataIndex: 'is_bind',
      render: (text, record) => ({0: <Tag color="blue">未绑定</Tag>, 1: <Tag color="green">绑定</Tag>, 2: <Tag color="red">更换</Tag>}[record.is_bind])
    }, {
      title: '操作',
      render: (text, record) => <span>
        <a onClick={() => {
          this.setState({morevisible: true, eventType: '修改', editData: record});
        }}>详情</a>
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
      url: url_getTbox, 
      data: {
        tboxCode: this.queryForm.tboxCode,
        startTime: this.queryForm.startTime,
        endTime: this.queryForm.endTime,
        state: this.queryForm.state,
        version: this.queryForm.version,
        orgId: this.queryForm.orgId,
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
  
  getEditItem = itemText => this.state.eventType === '添加' ? '' : this.state.editData[itemText];

  componentDidMount() {
    this.props.dispatch(getSelectOrg());
  }
  doExport = async () => {
    this.setState({exportLoading: true});
    console.warn(document.all ? 1:0);
    const res = await Axios({
      url: url_getTboxToExcel,
      data: {
        tboxCode: this.queryForm.tboxCode,
        startTime: this.queryForm.startTime,
        endTime: this.queryForm.endTime,
        state: this.queryForm.state,
        version: this.queryForm.version,
        orgId: this.queryForm.orgId,
      }
    });
    if(res) {
      // let aLink = document.createElement('a');
      // aLink.href = res.data[0].path;
      window.open(res.data[0].path);
      // if(document.all) {
      //   aLink.click();
      // } else {
      //   let env = document.createEvent('MouseEvents');
      //   env.initEvent('click', true, true);
      //   aLink.dispatchEvent(env);
      // }
    } else {

    }
    this.setState({exportLoading: false});
  }
}

export default connect((state, props) => {
  const urlArr = props.match.url.split('/');
  return  {
    selectOrg: state.selectOrg,
    ruleList: state.userInfo.buttonRulesV2 && state.userInfo.buttonRulesV2[urlArr[urlArr.length - 1]] || {},
  }
})(deviceInfo);