import React, { Component } from 'react';
import { Table, Row, Col, Input, Button, Modal, Select, Popconfirm, message, Upload, DatePicker } from 'antd';
import axios from 'axios';

import '../layout/style.less';
import { Axios } from '../../interface';
import { url_getGroupCar, url_getCarToGroup, url_postGroupCar, url_delGroupCar, url_postGroupCarByExcel, url_getMenuType } from '../../utils/config/api';
import { StandModal, MoreModal } from '../../components'
import {connect} from 'react-redux';
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
class groupItemMag extends Component {
  render() {
    return (
      <div className="groupItemMag">
        <div className="search-form">
          <Row gutter={24}>
            <Col  {...ColProps}>
              <Select placeholder="车厂" style={{width: '100%'}} onChange={e => {
                this.selCarFacOnChangeList(e);
                this.setState({carOrg: e});
              }}>
                <Option value="">车厂</Option>
                {this.props.selectOrg.map((v, i) => <Option value={v.id} key={v.id}>{v.org_name}</Option>)}
              </Select>
            </Col>
            <Col  {...ColProps}>
              <Select style={{width: '100%'}} placeholder="车型" onChange={e => {
                this.setState({carType: e});
              }}>
                <Option value="">车型</Option>
                {this.state.carTypeSelectList.map((v, i) => <Option value={v.id}>{v.type_name}</Option>)}
              </Select>
            </Col>
            <Col  {...ColProps}>
              <RangePicker placeholder={['生产开始时间', '生产结束时间']} showTime format="YYYY-MM-DD HH:mm:ss" 
                onChange={e => {
                  e.length > 0 ? this.setState({startTime: e[0].format('YYYY-MM-DD HH:mm:ss'), endTime: e[1].format('YYYY-MM-DD HH:mm:ss')}) 
                    : this.setState(this.setState({startTime: '', endTime: ''}));
                }}
                style={{width: '100%'}}
              />
            </Col>
            <Col  {...ColProps}>
              <Input placeholder="VIN" onChange={e => this.setState({vin: e.target.value})}/>
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
            rowSelection={{
              onChange: (selectedRowKeys, selectedRows) => {
                console.log(`selectedRowKeys:`, selectedRowKeys, 'selectedRows: ', selectedRows);
                this.setState({selectedRowKeys});
              },
              selectedRowKeys: this.state.selectedRowKeys,
            }}
            //scroll={{x: 1250}}//宽度
          />
        </div>
        <Button type="primary" icon="check" className="submitButton" onClick={this.onSubmit} loading={this.state.submitLoading}>提交({this.state.selectedRowKeys.length}项)</Button>
        <Button type="primary" icon="upload" className="submitButton" 
          onClick={() => this.setState({importVisible: true})}>导入</Button>
        <br style={{clear: 'both'}}/>
        <Modal
          visible={this.state.importVisible}
          onCancel={() => {this.setState({importVisible: false});}}
          onOk={this.carImport}
          confirmLoading={this.state.importLoading}
          title="导入Excel"
          key={this.state.importVisible + 'import'}
          maskClosable={false}
        >
          <Row gutter={24}>
            <Col span={24}> 
              <Upload 
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
                <Button icon="upload" disabled={this.state.fileList.length > 0}>选择文件</Button>
              </Upload>
            </Col>
          </Row>
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

      importVisible: false,
      fileList: [],
      importLoading: false,
      carTypeSelect: [],
      carTypeSelectList: [],//添加下拉

      carOrg: '',
      carType: '',
      startTime: '',
      endTime: '',
      vin: '',
      selectedRowKeys: [],
      submitLoading: false,
    };
    this.columns =[{
      title: 'VIN',
      dataIndex: 'vin',
    }, {
      title: '车型',
      dataIndex: 'type_name',
    }, {
      title: '生产日期',
      dataIndex: 'produce_time',
    }, {
      title: '车辆状态',
      dataIndex: 'status',
      render: (text) => ({0: '未录入', 1: '审核中', 2: '审核不通过', 3: '待入库', 4: '待销售', 5: '已销售', }[text]),
    }
    // , {
    //   title: '操作',
    //   render: (text, record) => <span>
    //     {/* <a onClick={() => {
    //       this.setState({morevisible: true, eventType: '修改', editData: record});
    //     }}>详情</a>
    //     <span className="ant-divider" /> */}
    //     {/* <a onClick={() => {
    //       this.setState({addVisible: true, eventType: '修改', editData: record});
    //     }}>修改</a>
    //     <span className="ant-divider" /> */}
    //     <Popconfirm title="确定要删除?" onConfirm={this.doDel.bind(null, record.id)}>
    //       <a>删除</a>
    //     </Popconfirm>
    //   </span>,
    // }
    ];
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
      url: url_getCarToGroup, 
      data: {
        groupId: this.props.id,
        vin: this.state.vin,
        proStartTime: this.state.startTime,
        proEndTime: this.state.endTime,
        orgId: this.state.carOrg,
        carTypeId: this.state.carType,
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
      v.groupId = this.props.id;
      res = await Axios({
        url: url_postGroupCar,
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
  onSubmit = () => {
    if(this.state.selectedRowKeys.length === 0) {
      message.warning('请至少选择一条数据！');
      return false;
    }
    this.setState({submitLoading: true});
    Axios({
      url: url_postGroupCar,
      data: {
        groupId: this.props.id,
        carIds: this.state.selectedRowKeys.toString(),
      }
    }).then(res => {
      if(res) {
        message.success('提交成功!');
        this.setState({selectedRowKeys: []});
      } else {
        message.warning('提交失败！');
      }
      this.setState({submitLoading: false});
    });
  }
  doDel = id => {
    this.setState({loading: true});
    Axios({
      url: url_delGroupCar,
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
  carImport = async () => {
    this.setState({importLoading: true});
    const res = await Axios({
      url: url_postGroupCarByExcel,
      data: {
        groupId: this.props.id,
      },
      files: [{originFileObj: this.state.fileList[this.state.fileList.length - 1]}],
    });
    if(res) {
      message.success('上传成功！');
    } else {}
    this.setState({importLoading: false});
  }
  selCarFacOnChange = e => {
    console.log(e);
    if(e) {
      Axios({
        url: url_getMenuType,
        data: {
          orgId: e,
        }
      }).then(res => {
          this.setState({carTypeSelect: res ? res.data : []});
      });
    }else {
      this.setState({carTypeSelect: []});
    }
  }
  selCarFacOnChangeList = e => {
    console.log(e);
    if(e) {
      Axios({
        url: url_getMenuType,
        data: {
          orgId: e,
        }
      }).then(res => {
          this.setState({carTypeSelectList: res ? res.data : []});
      });
    }else {
      this.setState({carTypeSelectList: []});
    }
  }
  componentDidMount() {
    this.props.dispatch(getSelectOrg());
  }
}

export default connect((state, props) => ({selectOrg: state.selectOrg}))(groupItemMag);