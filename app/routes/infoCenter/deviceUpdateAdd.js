import React, { Component } from 'react';
import { Table, Row, Col, Input, DatePicker, Select, Button, Modal, Popconfirm, Upload, message } from 'antd';
import { connect } from 'react-redux';
import moment from 'moment';

import { DisDivWithTitle } from '../../components';
import { getSelectOrg } from '../../actions';
import { Axios } from '../../interface';
import { url_getTboxConCar, url_postTboxUpSend, url_getType, url_postTboxUpCarByExcel } from '../../utils/config/api';
import DeviceParamAddlist from './deviceParamAddList';

const { RangePicker } = DatePicker;
const { Option } = Select;

class deviceUpdateAdd extends Component {
  render() {
    return (
      <div className="deviceUpdateAdd">
        <DisDivWithTitle title="选择终端">
          <div className="choicedev">
            <span>终端编号：</span><Input style={{width: 200}} className="item" onChange={e => this.queryForm.vin = e.target.value}/>
            <span>终端生产日期：</span><RangePicker onChange={e => this.queryForm.createTime = (e.toString() ? [e[0].format('YYYY-MM-DD'), e[1].format('YYYY-MM-DD')] : ['', ''])}/>
          </div>
          <div className="choicedev">
            <span>车厂：</span>
            <Select className="item" style={{width: 120}} onChange={this.selCarFacOnChange}>
              <Option value="">&nbsp;</Option>
              {this.props.selectOrg.map(v => <Option key={v.id} value={v.id.toString()}>{v.org_name}</Option>)}
            </Select> 
            <span>车型：</span>
              <Select className="item" style={{width: 120}} onChange={e => this.queryForm.carType = e}>
                <Option value="">车型</Option>
                {this.state.carTypeSelect.map(v => <Option key={v.id} value={v.id.toString()}>{v.type_name}</Option>)}  
              </Select> 
            <span>终端绑定日期：</span><RangePicker onChange={e => this.queryForm.bindTime = e.toString() ? [e[0].format('YYYY-MM-DD'), e[1].format('YYYY-MM-DD')] : ['', '']}/> 
          </div>
          <div className="choicedev" style={{justifyContent: "space-around"}}>
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
              <Button type="primary" ghost icon="file-text" disabled={this.state.fileList.length > 0}>选择文件</Button>
            </Upload>
            <Button type="primary" icon="upload" onClick={this.doUpload} loading={this.state.uploadLoading}>导入</Button>
            <Button type="primary" icon="search" loading={this.state.queryLoading} onClick={this.query.bind(null, 1, 10)}>检索</Button>
            <div><span>检索到符合条件的终端</span><Input style={{width: 50}} readOnly ref="listCount" defaultValue={0}/><span>个</span></div>
            <Button type="primary" disabled={this.state.showListData.length === 0} onClick={() => {this.setState({showListVisible: true})}}>查看清单</Button>
          </div>
        </DisDivWithTitle>
        <DisDivWithTitle title="升级内容">
          <div className="choicedev">
             <span>升级内容描述：</span>
             <Input type="textarea" autosize={{minRows: 4}} style={{width: 630}} onChange={e => this.queryForm.upDesc = e.target.value}/> 
          </div>
          <div className="choicedev">
            <span>版本：<Input style={{width: 120}} onChange={e => this.setState({upVersion: e.target.value})}/></span>
            <Upload 
              onRemove={(file) => {
                this.setState(({ upFileList }) => {
                  const index = upFileList.indexOf(file);
                  const newFileList = upFileList.slice();
                  newFileList.splice(index, 1);
                  return {
                    upFileList: newFileList,
                  };
                });
              }}
              beforeUpload={(file) => {
                this.setState(({ upFileList }) => ({
                  upFileList: [...upFileList, file],
                }));
                return false;
              }}
              fileList={this.state.upFileList}
            >
              <Button type="primary" icon="upload" ghost disabled={this.state.upFileList.length > 0}>上传升级文件</Button>
            </Upload>
            <Popconfirm title="确定发送吗?" onConfirm={this.sendUpload}>
              <Button type="primary" loading={this.state.sendUploadL} 
                disabled={!this.state.upVersion || this.state.upFileList.length === 0}
                title="版本号与升级文件为必填内容">下发升级</Button>
            </Popconfirm>
          </div>
        </DisDivWithTitle>
        <Modal
          visible={this.state.showListVisible}
          onOk={() => this.setState({showListVisible: false})}
          onCancel={() => this.setState({showListVisible: false})}
          title={null}
          footer={null}
          style={{top: 30}}
          width={700}
        >
          <DeviceParamAddlist data={this.state.showListData} handleTableChange={this.handleTableChange}
            pageSize={this.state.pageSize} current={this.state.current} total={this.state.total}
            loading={this.state.queryLoading}
          />
        </Modal>
      </div>
    );
  }
  constructor(props) {
    super(props);
    this.state = {
      queryLoading: false,
      showListVisible: false,
      showListData: [],
      carTypeSelect: [],

      pageSize: 10,
      total: 0,
      current: 1,

      sendUploadL: false,

      fileList: [],
      upFileList: [],
      uid: '',
      uploadLoading: false,
      upVersion: '',
    }
    this.queryForm = {
      vin: '',
      createTime: ['', ''],
      carFac: '',
      carType: '',
      bindTime: ['', ''],
      upDesc: '',
      //upVersion: '',//废弃
    };
  }
  componentDidMount() {
    //获取车厂下拉
    const dispatch = this.props.dispatch;
    dispatch(getSelectOrg());
  }
  doUpload = async () => {
    this.setState({uploadLoading: true});
    if(this.state.fileList.length > 0) {
      const res =  await Axios({
        url: url_postTboxUpCarByExcel,
        data: {setId: '',},
        files: [{originFileObj: this.state.fileList[this.state.fileList.length - 1]}],
      });
      if(res) {
        message.success('上传成功！');
        this.setState({uid: res.data[0].uid});
      } else {}
    } else {
      message.warning('请选择一个文件！');
    }
    this.setState({uploadLoading: false});
  }
  query = (current, pageSize) => {
    this.setState({queryLoading: true, uid: ''});
    Axios({
      url: url_getTboxConCar,
      data: {
        tboxCode: this.queryForm.vin,
        tboxProStartTime: this.queryForm.createTime[0],
        tboxProEndTime: this.queryForm.createTime[1],
        orgId: this.queryForm.carFac,
        carTypeId: this.queryForm.carType,
        tboxBindStartTime: this.queryForm.bindTime[0],
        tboxBindEndTime: this.queryForm.bindTime[1],
        pageSize: pageSize,
        pageIndex: current,
        orderBy: '',
        desc: '',
      }
    }).then(res => {
      if(res){
        this.setState({
          showListData: res.data,
          total: res.tols,
          pageSize,
          current,
        });
        this.refs.listCount.refs.input.value = res.tols;
      }else {
        this.setState({
          showListData: [],
          total: res.tols,
          pageSize,
          current,
        });
        this.refs.listCount.refs.input.value = 0;
      }
      this.setState({queryLoading: false});
    });
  }
  handleTableChange = (pagination) => {
    this.query(pagination.current, pagination.pageSize);
  }
  sendUpload =() => {
    this.setState({sendUploadL: true});
    Axios({
      url: url_postTboxUpSend,
      data: {
        uid: this.state.uid,
        tboxCode: this.queryForm.vin,
        tboxProStartTime: this.queryForm.createTime[0],
        tboxProEndTime: this.queryForm.createTime[1],
        orgId: this.queryForm.carFac,
        carTypeId: this.queryForm.carType,
        tboxBindStartTime: this.queryForm.bindTime[0],
        tboxBindEndTime: this.queryForm.bindTime[1],
        version: this.state.upVersion,
        desc: this.queryForm.upDesc,
      },
      files: [{originFileObj: this.state.upFileList[this.state.upFileList.length - 1]}],
    }).then(res => {
      if(res) {
        message.info(res.detail);
      }
      this.setState({sendUploadL: false});
    });
  }
  selCarFacOnChange = e => {
    this.queryForm.carFac = e;
    if(e) {
      Axios({
        url: url_getType,
        data: {
          id: '',
          orgId: e,
          typeName: '',
        }
      }).then(res => {
          this.setState({carTypeSelect: res ? res.data : []});
      });
    }else {
      this.setState({carTypeSelect: []});
    }
  }
}

export default connect((state, p) => 
  ({ selectOrg: state.selectOrg }))(deviceUpdateAdd);