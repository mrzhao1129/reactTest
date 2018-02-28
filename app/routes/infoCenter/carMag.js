import React, { Component } from 'react';
import { Table, Row, Col, Input, Button, Modal, Select, Popconfirm, message, DatePicker, Upload } from 'antd';
import axios from 'axios';
import { connect } from 'react-redux';
import moment from 'moment';

import '../layout/style.less';
import { Axios } from '../../interface';
import { url_getCar, url_postCar, url_putCar, url_delCar, url_getMenuType, 
  url_getCarToExcel, url_postCarByExcel } from '../../utils/config/api';
import { StandModal, MoreModal } from '../../components';
import { getSelectOrg, getSelectType } from '../../actions';

const {Option} = Select;
const {RangePicker} = DatePicker;
const { Group: ButtonGroup } = Button;
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
            <Col {...ColProps}>
              <Select placeholder="车厂" style={{width: '100%'}} onChange={e => {this.queryForm.carFac = e; this.selCarFacOnChange(e);}}>
                <Option value="">车厂</Option>
                {this.props.selectOrg.map((v, i) => <Option value={v.id}>{v.org_name}</Option>)}
              </Select>
            </Col>
            <Col {...ColProps}>
              <Select placeholder="车型" style={{width: '100%'}} onChange={e => this.queryForm.carType = e}>
                <Option value="">车型</Option>
                {this.state.carTypeSelect.map((v,i ) => <Option value={v.id}>{v.type_name}</Option>)}
              </Select>
            </Col>
            <Col {...ColProps}>
              <Select placeholder="状态" style={{width: '100%'}} onChange={e => this.queryForm.state = e}>
              </Select>
            </Col>
            <Col {...ColProps}><RangePicker showTime placeholder={['生产开始日期', '生产结束日期']} style={{width: '100%'}} onChange={e => {
              if(e.length === 0) {
                this.queryForm.startTime = '';
                this.queryForm.endTime = '';
              }else {
                this.queryForm.startTime = e[0].format('YYYY-MM-DD HH:mm:ss');
                this.queryForm.endTime = e[1].format('YYYY-MM-DD HH:mm:ss');
              }
            }} format="YYYY-MM-DD HH:mm:ss"/></Col>
            <Col {...ColProps}><Input placeholder="VIN码" onChange={e => this.queryForm.vin = e.target.value}/></Col>
            <Col {...ColProps} className="queryBtnGroup">
              <Button type="primary" icon="search" onClick={this.query.bind(null, 1, 10)}>查询</Button> 
              {this.props.ruleList.addRule ? <Button type="primary" icon="plus" onClick={
                () => this.setState({addVisible: true, eventType: '添加'})}>添加</Button> : ''}
              {this.props.ruleList.expRule ? <Button type="primary" icon="download" 
                onClick={this.download} loading={this.state.exportLoading} title="导出"></Button> : ''}
              {this.props.ruleList.expRule ? <Button type="primary" icon="upload" 
                onClick={() => this.setState({importVisible: true})} title="导入"></Button> : '' }
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
            {label: 'VIN码', type: <Input />, key: 'vin', init: this.getEditItem('vin')}, 
            {label: '车型', type: 
              <Select style={{width: '100%'}}>
                {this.props.selectType.map((v, i) => <Option value={v.id}>{v.type_name}</Option>)}
              </Select>, key: 'carTypeId', init: this.getEditItem('car_type_id')}, 
            {label: '车身颜色', type: <Input />, key: 'carColor', init: this.getEditItem('car_color')}, 
            {label: '车牌', type: <Input />, key: 'carPlate', init: this.getEditItem('car_plate')}, 
            {label: '电机号', type: <Input />, key: 'machineNo', init: this.getEditItem('machine_no')}, 
            {label: '终端编号', type: <Input />, key: 'tboxCode', init: this.getEditItem('tbox_code')}, 
            {label: '生产日期', type: <DatePicker format="YYYY-MM-DD HH:mm:ss" showTime style={{width: '100%'}}/>, key: 'produceTime', init: this.getEditItem('produce_time') ? moment(this.getEditItem('produce_time')) : undefined}, 
            {label: '下线日期', type: <DatePicker format="YYYY-MM-DD HH:mm:ss" showTime style={{width: '100%'}}/>, key: 'releaseTime', init: this.getEditItem('release_time') ? moment(this.getEditItem('release_time')) : undefined}, 
            {label: '其他', type: <Input />, key: 'remark', init: this.getEditItem('remark')}, 
          ]}
        </StandModal>
        <MoreModal title="详情" visible={this.state.morevisible}
          onCancel={() => this.setState({morevisible: false})}
        >
          {[
            {label: 'id', init: this.getEditItem('id')}, 
            {label: '车型ID', init: this.getEditItem('car_type_id')}, 
            {label: '类型名称', init: this.getEditItem('type_name')}, 
            {label: '分组名称', init: this.getEditItem('group_name')}, 
            {label: '区域ID', init: this.getEditItem('area_id')}, 
            {label: '车厂ID', init: this.getEditItem('org_id')}, 
            {label: '车厂名称', init: this.getEditItem('org_name')}, 
            {label: '生产时间', init: this.getEditItem('produce_time')}, 
            {label: '入库日期', init: this.getEditItem('storage_time')}, 
            {label: '下线日期', init: this.getEditItem('release_time')}, 
            {label: '销往', init: this.getEditItem('send_to')}, 
            {label: '状态', init: this.getEditItem('status')}, 
            {label: 'vin', init: this.getEditItem('vin')}, 
            {label: '电池包编号', init: this.getEditItem('battery_pack_number')}, 
            {label: '电池类型', init: this.getEditItem('battery_type')}, 
            {label: '车身颜色', init: this.getEditItem('car_color')}, 
            {label: '车牌', init: this.getEditItem('car_plate')}, 
            {label: '车系', init: this.getEditItem('car_series')}, 
            {label: '配置', init: this.getEditItem('configuration')}, 
            {label: '控制器号', init: this.getEditItem('control_no')}, 
            {label: '变速箱号', init: this.getEditItem('gear_box_no')}, 
            {label: '终端编号', init: this.getEditItem('tbox_code')}, 
            {label: '变速箱类型', init: this.getEditItem('structure_features')}, 
            {label: '电机号', init: this.getEditItem('machine_no')}, 
            {label: '3G卡号', init: this.getEditItem('no_3g')}, 
            {label: 'GPRS号', init: this.getEditItem('gprs_no')}, 
            {label: '定位地址', init: this.getEditItem('gps_address')}, 
            {label: '定位时间', init: this.getEditItem('gps_time')}, 
            {label: '纬度', init: this.getEditItem('lat')}, 
            {label: '经度', init: this.getEditItem('lng')},
            {label: '创建人', init: this.getEditItem('creator')},
            {label: '创建时间', init: this.getEditItem('create_time')},
            {label: '修改人', init: this.getEditItem('editor')},
            {label: '修改时间', init: this.getEditItem('edit_time')},
            {label: '备注', init: this.getEditItem('remark')},
          ]}
        </MoreModal>
        <Modal
          visible={this.state.importVisible}
          onCancel={() => {this.setState({importVisible: false, fileList: []});
            this.importQueryForm.carFac = '';
            this.importQueryForm.carType = '';
          }}
          onOk={this.carImport}
          confirmLoading={this.state.importLoading}
          title="导入Excel"
          key={this.state.importVisible + 'import'}
          maskClosable={false}
        >
          <Row gutter={24}>
            <Col span={12} style={{marginBottom: 6}}>
              <Select style={{width: '100%'}} placeholder="车厂" 
                onChange={e => {this.importQueryForm.carFac = e; this.importSelCarFacOnChange(e);}}>
                <Option value="">车厂</Option>
                {this.props.selectOrg.map((v, i) => <Option value={v.id}>{v.org_name}</Option>)}
              </Select>
            </Col>
            <Col span={12}  style={{marginBottom: 6}}>
              <Select style={{width: '100%'}} placeholder="车型" 
                onChange={e => {this.importQueryForm.carType = e;}}>
                <Option value="">车型</Option>
                {this.state.importCarTypeSelect.map((v,i ) => <Option value={v.id}>{v.type_name}</Option>)}
              </Select>
            </Col>
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
      exportLoading: false,
      importLoading: false,

      addVisible: false,
      eventType: '添加',
      editData: {},
      confirmLoading: false,

      morevisible: false,
      carTypeSelect: [],

      importVisible: false,
      importCarTypeSelect: [],
      fileList: [],
    };
    this.queryForm = {
      carFac: '',
      carType: '',
      state: '',
      startTime: '',
      endTime: '',
      vin: '',
    };
    this.importQueryForm = {
      carFac: '',
      carType: '',
    }
    this.columns =[{
      title: '车架号',
      dataIndex: 'vin',
    }, {
      title: '车牌号',
      dataIndex: 'car_plate',
    }, {
      title: '电机号',
      dataIndex: 'machine_no',
    }, {
      title: '终端号',
      dataIndex: 'tbox_code',
    }, {
      title: '车厂',
      dataIndex: 'org_name',
    }, {
      title: '车型',
      dataIndex: 'type_name',
    }, {
      title: '组别',
      dataIndex: 'group_name',
    }, {
      title: '生产日期',
      dataIndex: 'produce_time',
    }, {
      title: '车辆状态',
      dataIndex: 'status',
      render: (text) => ({0: '未录入', 1: '审核中', 2: '审核不通过', 3: '待入库', 4: '待销售', 5: '已销售', }[text]),
    }, {
      title: '车辆用途',
      dataIndex: '',
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
    // axios({url: '/api/deviceMag'}).then(v => {
    //   this.setState({
    //     data: v.data.data,
    //     loading: false
    //   });
    // });
    Axios({
      url: url_getCar, 
      data: {
        id: '',
        orgId: this.queryForm.carFac,
        vin: this.queryForm.vin,
        carTypeId: this.queryForm.carType,
        startTime: this.queryForm.startTime,
        endTime: this.queryForm.endTime,
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
        url: url_postCar,
        data: v
      })
    }else if(this.state.eventType === '修改') {
      const vWithId = v;
      vWithId.id = this.state.editData.id;
      res = await Axios({
        url: url_putCar,
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
    this.setState({confirmLoading: false, fileList: []});
  }
  getEditItem = itemText => this.state.eventType === '添加' ? '' : this.state.editData[itemText];
  doDel = id => {
    this.setState({loading: true});
    Axios({
      url: url_delCar,
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
    dispatch(getSelectType());
  }
  selCarFacOnChange = e => {
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
  importSelCarFacOnChange = e => {
    if(e) {
      Axios({
        url: url_getMenuType,
        data: {
          orgId: e,
        }
      }).then(res => {
          this.setState({importCarTypeSelect: res ? res.data : []});
      });
    }else {
      this.setState({importCarTypeSelect: []});
    }
  }
  download = async () => {
    this.setState({exportLoading: true});
    const res = await Axios({
      url: url_getCarToExcel, 
      data: {
        id: '',
        orgId: this.queryForm.carFac,
        vin: this.queryForm.vin,
        carTypeId: this.queryForm.carType,
        startTime: this.queryForm.startTime,
        endTime: this.queryForm.endTime,
        pageSize: this.state.pageSize,
        pageIndex: this.state.current,
        orderBy: 'create_time',
        desc: 'desc',
      }
    })
    if(res) {
      window.open(res.data[0].path);
    } else {}
    this.setState({exportLoading: false});
  }
  carImport = async () => {
    this.setState({importLoading: true});
    const res = await Axios({
      url: url_postCarByExcel,
      data: {
        orgId: this.importQueryForm.carFac,
        carTypeId: this.importQueryForm.carType,
      },
      files: [{originFileObj: this.state.fileList[this.state.fileList.length - 1]}],
    });
    if(res) {
      message.success('上传成功！');
    } else {}
    this.setState({importLoading: false});
  }
}
export default connect((state, props) => {
  const urlArr = props.match.url.split('/');
  return {
    selectOrg: state.selectOrg,
    selectType: state.selectObj.selectType,
    ruleList: state.userInfo.buttonRulesV2 && state.userInfo.buttonRulesV2[urlArr[urlArr.length - 1]] || {},
  }
})(sysMag);