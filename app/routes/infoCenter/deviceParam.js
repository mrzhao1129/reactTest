//参数设置
import React, { Component } from 'react';
import { Table, DatePicker, Button, Row, Col, Popconfirm, message, Modal } from 'antd';
import axios from 'axios';
import { connect } from 'react-redux';

import '../layout/style.less';
import { Axios } from '../../interface';
import AddConfig from './deviceParamAdd';
import { url_getTboxConSendCount, url_getTboxConSend, url_putTboxConSendEnd } from '../../utils/config/api';
import { MoreModal } from '../../components';

const { RangePicker } = DatePicker;
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
class deviceParam extends Component {
  constructor(props) {
    super(props);
    this.state= {
      data: [],//表格数据
      loading: false,//加载ing
      pageSize: 10,
      total: 0,
      current: 1,

      addVisible: false,
      moreVisible: false,
      eventType: '添加',
      editData: {},

      loadVisible: false,
      loadData: [],
      loadLoading: false,
      loadPageSize: 10,
      loadTotal: 0,
      loadCurrent: 1,
    };
    this.queryForm = {
      timeRange: [],
    }
    this.columns = [{
      title: '序号',
      dataIndex: 'id',
      width: 250,
    }, {
      title: '配置原因',
      dataIndex: 'set_reason',
      width: 70,
    }, {
      title: '配置时间',
      dataIndex: 'create_time',
      width: 150,
    }, {
      title: '已配置成功数目',
      dataIndex: 'success_num',
      width: 110,
    }, {
      title: '总配置数目',
      dataIndex: 'tol_num',
      width: 80,
    }, {
      title: '状态',
      dataIndex: 'state',
      render: (text, record) => ({0: '未发送', 1: '发送中', 2: '结束或取消'}[record.state] || record.state),
      width: 80,
    }, {
      title: '操作',
      // key: 'action',
      // key: 'key',
      render: (text, record) => (
        <span>
          <a onClick={() => 
            this.setState({moreVisible: true, eventType: '修改', editData: record})}>详情</a>
          {this.props.ruleList.editRule ? <span>
            <span className="ant-divider" />
            <a onClick={() => {this.state.editData = record;this.getSchedule(1, 10);}}>进度</a>
          </span> : ''}
          {this.props.ruleList.delRule ? <span>
            <span className="ant-divider" />
            <Popconfirm title="确定要取消?" onConfirm={this.doCancel.bind(null, record.id)}>
              <a>取消</a>
            </Popconfirm>
          </span> : ''}
        </span>
      ),
      width: 130,
    }];
    this.loadColumns = [{
      title: 'VIN',
      dataIndex: 'vin',
      width: 150,
    }, {
      title: '车型',
      dataIndex: 'type_name',
      width: 50,
    }, {
      title: '组织机构',
      dataIndex: 'org_name',
      width: 100,
    }, {
      title: '内容',
      dataIndex: 'content',
      width: 300,
    }, {
      title: 'TBOX参数ID',
      dataIndex: 'tbox_param_id',
      width: 250,
    }, {
      title: '发送数量',
      dataIndex: 'send_num',
      width: 70,
    }, {
      title: '状态',
      dataIndex: 'is_success',
      render: (text, record) => ({0: '失败', 1: '成功'}[record.is_success] || record.is_success),
      width: 50,
    }, {
      title: '成功时间',
      dataIndex: 'success_time',
      width: 170,
    }];
  }
  query = (current, pageSize) => {
    this.setState({loading: true});
    // axios({url: '/api/deviceMag'}).then(v => {
    //   this.setState({
    //     data: v.data.data,
    //     loading: false,
    //   });
    // });
    Axios({
      url: url_getTboxConSendCount,
      data: {
        startTime: this.queryForm.timeRange[0] || '',
        endTime: this.queryForm.timeRange[1] || '',
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
  getSchedule = (current, pageSize) => {
    this.setState({loadLoading: true, loading: true,});
    Axios({
      url: url_getTboxConSend,
      data: {
        setId: this.state.editData.id,
        pageSize: pageSize,
        pageIndex: current,
        orderBy: '',
        desc: '',
      }
    }).then(res => {
        this.setState((prevState, props) => ({
          loadData: res ? res.data : [],
          loadVisible: res ? true : false,
          loadLoading: false,
          loading: false,
          pageSize,
          current,
        }));
    });
  }
  doCancel = id => {
    Axios({
      url: url_putTboxConSendEnd,
      data: {
        setId: id
      }
    }).then(res => {
      console.log(res);
      if(res) {
        // message.info(res.detail);
        message.success('取消成功');
        this.query(this.state.current, this.state.pageSize);
      }
    });
  }
  getEditItem = itemText => this.state.eventType === '添加' ? '' : this.state.editData[itemText];
  render() {
    return (
      <div className="deviceParam">
        <div className="search-form">
          <Row gutter={24}>
            <Col {...ColProps}>
              <RangePicker style={{ width: "100%" }}
                placeholder={['配置开始日期', '配置结束日期']} onChange={e => this.queryForm.timeRange = e.length > 0 ? [e[0].format('YYYY-MM-DD'), e[1].format('YYYY-MM-DD')] : []}/>
            </Col>
            <Col  {...ColProps} className="queryBtnGroup">
              <Button type="primary" icon="search" onClick={this.query.bind(null, 1, 10)}>查询</Button> 
              {/* <Button type="primary" icon="download">导出</Button> */}
              {this.props.ruleList.addRule ? <Button type="primary" icon="plus" 
                onClick={() => this.setState({addVisible: true})}>新增</Button> : ''}
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
            rowKey={record => record.id}//key 
            bordered
            size="middle"
            scroll={{x: 870}}//宽度
          />
        </div>
        <Modal
          visible={this.state.addVisible}
          onOk={() => this.setState({addVisible: false})}
          onCancel={() => this.setState({addVisible: false})}
          title={null}
          footer={null}
          width={800}
          key={Math.random()}
          maskClosable={false}
          style={{top: 20}} 
        ><AddConfig /></Modal>
        <MoreModal
          visible={this.state.moreVisible}
          title="详情"
          onCancel={() => this.setState({moreVisible: false})}
        >
          {[
            {label: 'ID', init: this.getEditItem('id')},
            {label: '车型ID', init: this.getEditItem('car_type_id')},
            {label: '创建时间', init: this.getEditItem('create_time')},
            {label: '组织ID', init: this.getEditItem('org_id')},
            {label: '组织名称', init: this.getEditItem('org_name')},
            {label: '类型名称', init: this.getEditItem('type_name')},
            {label: '配置内容', init: this.getEditItem('set_content')},
            {label: '配置原因', init: this.getEditItem('set_reason')},
            {label: '状态', init: {0: '未发送', 1: '发送中', 2: '结束或取消'}[this.getEditItem('state')]},
            {label: '配置成功数目', init: this.getEditItem('success_num')},
            {label: '总配置数目', init: this.getEditItem('tol_num')},
          ]} 
        </MoreModal>
        <Modal
          visible={this.state.loadVisible}
          onOk={() => this.setState({loadVisible: false})}
          onCancel={() => this.setState({loadVisible: false})}
          title="进度"
          footer={null}
          width={'95%'}
          key={Math.random()}
          maskClosable={false}
          
        >
          <Table 
            columns={this.loadColumns} 
            dataSource={this.state.loadData}     
            onChange={pagination => this.getSchedule.bind(null, pagination.current, pagination.pageSize)} 
            loading = {this.state.loadLoading}
            pagination = {{
              showTotal: (total, range) => `${range[0]}-${range[1]} 共${total}`,
              showQuickJumper: true,
              showSizeChanger: true,
              pageSize: this.state.loadPageSize,
              current: this.state.loadCurrent,
              total: this.state.loadTotal,
            }}
            rowKey="id"//key 
            bordered
            size="middle"
            scroll={{x: 1140}}
          />
        </Modal>
      </div>
    );
  }
}

export default connect((state, props) => {
  const urlArr = props.match.url.split('/');
  return {
    ruleList: state.userInfo.buttonRulesV2 && state.userInfo.buttonRulesV2[urlArr[urlArr.length - 1]] || {},
  }
})(deviceParam);