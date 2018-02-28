import React, { Component } from 'react';
import { Table, Row, Col, Input, Button, Modal, Select, Popconfirm, message, Tag } from 'antd';
import axios from 'axios';


import '../layout/style.less';
import { Axios } from '../../interface';
import { url_getArea, url_postArea, url_putArea, url_delArea, } from '../../utils/config/api';
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
class disDevideMag extends Component {
  render() {
    return (
      <div className="sysMag">
        <div className="search-form">
          <Row gutter={24}>
            <Col  {...ColProps}>
              <Input placeholder="组合简称" onChange={e => this.data.areaName = e.target.value}/>
            </Col>
            <Col  {...ColProps} className="queryBtnGroup">
              <Button type="primary" icon="search" onClick={this.query.bind(null, 1, 10)}>查询</Button> 
              {/* <Button type="primary" icon="plus" onClick={
                () => this.setState({addVisible: true, eventType: '添加'})}>添加</Button> */}
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
            {label: 'id', type: <Input />, key: 'id', init: this.getEditItem('id')}, 
            {label: '区域编号', type: <Input />, key: 'areaCode', init: this.getEditItem('area_code')}, 
            {label: '区域名称', type: <Input />, key: 'areaName', init: this.getEditItem('area_name')}, 
            {label: '简称', type: <Input />, key: 'shortName', init: this.getEditItem('short_name')}, 
            {label: '组合简称', type: <Input />, key: 'mergerShortName', init: this.getEditItem('merger_short_name')}, 
            {label: '类型', type: 
              <Select style={{width: '100%'}}>
                <Option value={0}>国</Option>
                <Option value={1}>省或直辖市或自治区</Option>
                <Option value={2}>市</Option>
                <Option value={3}>县/区</Option>
              </Select>, key: 'areaLevel', init: this.getEditItem('area_level')}, 
            {label: '父级id', type: <Input />, key: 'parentId', init: this.getEditItem('parent_id')}, 
            {label: '层级', type: <Input />, key: 'level', init: this.getEditItem('level')}, 
            {label: '邮编', type: <Input />, key: 'zipCode', init: this.getEditItem('zip_code')}, 
            {label: '经度', type: <Input />, key: 'longitude', init: this.getEditItem('longitude')}, 
            {label: '纬度', type: <Input />, key: 'latitude', init: this.getEditItem('latitude')}, 
          ]}
        </StandModal>
        <MoreModal title="详情" visible={this.state.morevisible}
          onCancel={() => this.setState({morevisible: false})}
        >
          {[
            {label: 'id', init: this.getEditItem('id')}, 
            {label: '区域编号', init: this.getEditItem('area_code')}, 
            {label: '区域名称', init: this.getEditItem('area_name')}, 
            {label: '简称', init: this.getEditItem('short_name')},
            {label: '组合简称', init: this.getEditItem('merger_short_name')},
            {label: '类型', init: this.getEditItem('area_level')},
            {label: '父级id', init: this.getEditItem('parent_id')},
            {label: '层级', init: this.getEditItem('level')},
            {label: '邮编', init: this.getEditItem('zip_code')},
            {label: '经度', init: this.getEditItem('longitude')},
            {label: '纬度', init: this.getEditItem('latitude')},
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
    this.data = {
      areaName: '',
    }
    this.columns =[{
      title: '简称',
      dataIndex: 'short_name',
    }, {
      title: '组合简称',
      dataIndex: 'merger_short_name',
    }, {
      title: '区域编码',
      dataIndex: 'area_code',
    }, {
      title: '区域名称',
      dataIndex: 'area_name',
    }, {
      title: '层级',
      dataIndex: 'level',
      render: (text, record) =>  <Tag color={{0: '#cccccc', 1: '#8c8c8c', 2: '#595959', 3: '#000000'}[record.level]}>{record.level}</Tag>
    }, {
      title: '经度',
      dataIndex: 'longitude',
    }, {
      title: '纬度',
      dataIndex: 'latitude',
    }, {
      title: '操作',
      render: (text, record) => <span>
        <a onClick={() => {
          this.setState({morevisible: true, eventType: '修改', editData: record});
        }}>详情</a>
        {/* <span className="ant-divider" />
        <a onClick={() => {
          this.setState({addVisible: true, eventType: '修改', editData: record});
        }}>修改</a>
        <span className="ant-divider" />
        <Popconfirm title="确定要删除?" onConfirm={this.doDel.bind(null, record.id)}>
          <a>删除</a>
        </Popconfirm> */}
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
      url: url_getArea, 
      data: {
        id: '',
        areaName: this.data.areaName,
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
        url: url_postArea,
        data: v
      })
    }else if(this.state.eventType === '修改') {
      res = await Axios({
        url: url_putArea,
        data: v,
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
      url: url_delArea,
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
}

export default disDevideMag;