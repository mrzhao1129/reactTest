import React, { Component } from 'react';
import { Table, Row, Col, Input, DatePicker, Select, Button, Form, InputNumber, Upload, message, Modal, Popconfirm } from 'antd';
import { connect } from 'react-redux';
import moment from 'moment';

import { DisDivWithTitle } from '../../components';
import { getSelectOrg } from '../../actions';
import { Axios } from '../../interface';
import { url_getTboxConCar, url_postTboxWakeBySms, url_postTboxReset, url_postTboxShutdown, 
  url_postTboxConSel, url_postTboxConSend, url_getType, url_postTboxConCarByExcel } from '../../utils/config/api';
import DeviceParamAddlist from './deviceParamAddList';

const { RangePicker } = DatePicker;
const { Item: FormItem } = Form;
const { Option } = Select;

const formItemLayout = {
  labelCol: { span: 12 },
  wrapperCol: { span: 12 },
};

class deviceParamAdd extends Component {
  constructor(props) {
    super(props);
    
    this.queryForm = {
      vin: '',
      createTime: ['', ''],
      carFac: '',
      carType: '',
      bindTime: ['', ''],
      conReason: '',
    };
    this.state = {
      queryLoading: false,
      showListVisible: false,
      showListData: [],
      carTypeSelect: [],//车型select框数据

      pageSize: 10,
      total: 0,
      current: 1,

      callSMSL: false,//短信唤醒Loading
      sendDefL: false,
      calCloseL: false,
      paramSearchL: false,
      sendConfigL: false,

      fileList: [],
      uid: '',
      uploadLoading: false,
    };
    this.ulProps = {};
  }
  
  checkstationPort = (r, v, c) => {
    const num = parseInt(v);if(/^0|([1-9]\d*)$/.test(v) && num >= 0 && num <= 65531){c();}c(false);
  }
  checkIntegerRange = (range, r, v, c) => {
    const num = parseInt(v);if(/^([1-9]\d*)$/.test(v) && num >= range[0] && num <= range[1]){c();}c(false);
  }
  sendConfig = () => {
    this.props.form.validateFields(
      (err) => {
        if (!err) {
          console.log(this.props.form.getFieldsValue());
        }
      }
    );
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
  callSMS = () => {
    this.setState({callSMSL: true});
    Axios({
      url: url_postTboxWakeBySms,
      data: {
        uid: this.state.uid,
        tboxCode: this.queryForm.vin,
        tboxProStartTime: this.queryForm.createTime[0],
        tboxProEndTime: this.queryForm.createTime[1],
        orgId: this.queryForm.carFac,
        carTypeId: this.queryForm.carType,
        tboxBindStartTime: this.queryForm.bindTime[0],
        tboxBindEndTime: this.queryForm.bindTime[1],
        setReason: this.queryForm.conReason,
      }
    }).then(res => {
      if(res) {
        message.info(res.detail);
      }
      this.setState({callSMSL: false})
    });
  }
  sendDef = () => {
    this.setState({sendDefL: true});
    Axios({
      url: url_postTboxReset,
      data: {
        uid: this.state.uid,
        tboxCode: this.queryForm.vin,
        tboxProStartTime: this.queryForm.createTime[0],
        tboxProEndTime: this.queryForm.createTime[1],
        orgId: this.queryForm.carFac,
        carTypeId: this.queryForm.carType,
        tboxBindStartTime: this.queryForm.bindTime[0],
        tboxBindEndTime: this.queryForm.bindTime[1],
        setReason: this.queryForm.conReason,
      }
    }).then(res => {
      if(res) {
        message.info(res.detail);
      }
      this.setState({sendDefL: false})
    });
  }
  sendClose = () => {
    this.setState({calCloseL: true});
    Axios({
      url: url_postTboxShutdown,
      data: {
        uid: this.state.uid,
        tboxCode: this.queryForm.vin,
        tboxProStartTime: this.queryForm.createTime[0],
        tboxProEndTime: this.queryForm.createTime[1],
        orgId: this.queryForm.carFac,
        carTypeId: this.queryForm.carType,
        tboxBindStartTime: this.queryForm.bindTime[0],
        tboxBindEndTime: this.queryForm.bindTime[1],
        setReason: this.queryForm.conReason,
      }
    }).then(res => {
      if(res) {
        message.info(res.detail);
      }
      this.setState({calCloseL: false})
    });
  }
  paramSearch = () => {
    this.setState({paramSearchL: true});
    Axios({
      url: url_postTboxConSel,
      data: {
        uid: this.state.uid,
        tboxCode: this.queryForm.vin,
        tboxProStartTime: this.queryForm.createTime[0],
        tboxProEndTime: this.queryForm.createTime[1],
        orgId: this.queryForm.carFac,
        carTypeId: this.queryForm.carType,
        tboxBindStartTime: this.queryForm.bindTime[0],
        tboxBindEndTime: this.queryForm.bindTime[1],
        setReason: this.queryForm.conReason,
      }
    }).then(res => {
      if(res) {
        message.info(res.detail);
      }
      this.setState({paramSearchL: false})
    });
  }
  sendConfig = () => {
    this.setState({sendConfigL: true});
    console.log(this.props.form.getFieldsValue())
    Axios({
      url: url_postTboxConSend,
      data: {
        uid: this.state.uid,
        tboxCode: this.queryForm.vin,
        tboxProStartTime: this.queryForm.createTime[0],
        tboxProEndTime: this.queryForm.createTime[1],
        orgId: this.queryForm.carFac,
        carTypeId: this.queryForm.carType,
        tboxBindStartTime: this.queryForm.bindTime[0],
        tboxBindEndTime: this.queryForm.bindTime[1],
        setReason: this.queryForm.conReason,
        param: (function() {
          let obj = {};
          let fieldsValue = this.props.form.getFieldsValue();
          for(const v of Object.keys(fieldsValue)){
            fieldsValue[v] ? obj[v] = fieldsValue[v] : '';
          }
          return [obj];
        }.bind(this))(),
      }
    }).then(res => {
      if(res) {
        message.info(res.detail);
      }
      this.setState({sendConfigL: false})
    });
  }
  showList = () => {
    this.setState({showListVisible: true});
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
  componentDidMount = () => {
    //获取车厂下拉
    const dispatch = this.props.dispatch;
    dispatch(getSelectOrg());
  }
  doUpload = async () => {
    this.setState({uploadLoading: true});
    if(this.state.fileList.length > 0) {
      const res =  await Axios({
        url: url_postTboxConCarByExcel,
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
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div className="deviceParamAdd">
        <DisDivWithTitle title="选择终端">
          <div className="choicedev">
            <span>终端编号：</span><Input style={{width: 200}} className="item" onChange={e => this.queryForm.vin = e.target.value}/>
            <span>终端生产日期：</span>
            <RangePicker onChange={e => this.queryForm.createTime = (e.toString() ? [e[0].format('YYYY-MM-DD'), e[1].format('YYYY-MM-DD')] : ['', ''])}/>
          </div>
          <div className="choicedev">
            <span>车厂：</span>
            <Select className="item" style={{width: 120}} onChange={this.selCarFacOnChange}>
              <Option value="">&nbsp;</Option>
              {this.props.selectOrg.map(v => <Option key={v.id} value={v.id.toString()}>{v.org_name}</Option>)}    
            </Select> 
            <span>车型：</span>
            <Select className="item" style={{width: 120}} onChange={e => this.queryForm.carType = e}>
              <Option value="">&nbsp;</Option>
              {this.state.carTypeSelect.map(v => <Option key={v.id} value={v.id.toString()}>{v.type_name}</Option>)}
            </Select> 
            <span>终端绑定日期：</span>
            <RangePicker onChange={e => this.queryForm.bindTime = e.toString() ? [e[0].format('YYYY-MM-DD'), e[1].format('YYYY-MM-DD')] : ['', '']}/> 
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
            <div><span>检索到符合条件的终端</span><Input style={{width: 50}} readOnly defaultValue={0} ref="listCount"/><span>个</span></div>
            <Button type="primary" onClick={this.showList} disabled={this.state.showListData.length === 0}>查看清单</Button>
          </div>
          <div className="choicedev">
            <span>配置原因：</span>
            <Input style={{width: 600}} onChange={e => this.queryForm.conReason = e.target.value}/>
          </div>
        </DisDivWithTitle>
        <DisDivWithTitle title="配置参数">
          <Row gutter={24}>
            <Col span={12}>
              <FormItem {...formItemLayout} label="本地存储时间周期">
                {getFieldDecorator('0x01', {rules: [
                  { message: '有效范围1000~60000整数', validator: this.checkIntegerRange.bind(null, [1000, 60000]) }
                ], initialValue: 1000,})(<Input size="default" addonAfter="毫秒"/>)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem {...formItemLayout} label="信息上报时间周期">
                {getFieldDecorator('0x02', {rules: [
                  { message: '有效范围10~600整数', validator: this.checkIntegerRange.bind(null, [10, 600]) }
                ], initialValue: 60})(<Input size="default" addonAfter="秒" />)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem {...formItemLayout} label="远程服务平台域名">
                {getFieldDecorator('0x05', {rules: [
                ]})(<Input size="default"/>)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem {...formItemLayout} label="远程服务平台地址">
                {getFieldDecorator('0x92', {rules: [
                ]})(<Input size="default"/>)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem {...formItemLayout} label="远程服务平台端口">
                {getFieldDecorator('0x06', {rules: [
                  { message: '有效范围0~65531整数', validator: this.checkstationPort }
                ]})(<Input size="default"/>)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem {...formItemLayout} label="心跳发送周期">
                {getFieldDecorator('0x09', {rules: [
                  { message: '有效范围30~240整数', validator: this.checkIntegerRange.bind(null, [30, 240]) }
                ], initialValue: 180})(<Input size="default" addonAfter="秒"/>)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem {...formItemLayout} label="终端应答超时时间">
                {getFieldDecorator('0x0A', {rules: [
                  { message: '有效范围1000-60000整数', validator: this.checkIntegerRange.bind(null, [1000, 60000]) }
                ], initialValue: 10000})(<Input size="default" addonAfter="毫秒"/>)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem {...formItemLayout} label="平台应答超时时间">
                {getFieldDecorator('0x0B', {rules: [
                  { message: '有效范围1000-60000整数', validator: this.checkIntegerRange.bind(null, [1000, 60000]) }
                ], initialValue: 10000})(<Input size="default" addonAfter="毫秒"/>)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem {...formItemLayout} label="连续三次登录失败后，到下一次登入的间隔时间">
                {getFieldDecorator('0x0C', {rules: [
                  { message: '有效范围1-240整数', validator: this.checkIntegerRange.bind(null, [1, 240]) }
                ], initialValue: 30})(<Input size="default" addonAfter="分钟"/>)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem {...formItemLayout} label="公共平台域名">
                {getFieldDecorator('0x0E', {rules: [
                ]})(<Input size="default"/>)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem {...formItemLayout} label="公共平台地址">
                {getFieldDecorator('0x93', {rules: [
                ]})(<Input size="default"/>)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem {...formItemLayout} label="公共平台端口">
                {getFieldDecorator('0x0F', {rules: [
                  { message: '有效范围0~65531整数', validator: this.checkstationPort }
                ]})(<Input size="default"/>)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem {...formItemLayout} label="抽样监测状态">
                {getFieldDecorator('0x10', {rules: [
                ]})(<Select size="default" style={{width: "100%"}}><Option value="1">检测中</Option><Option value="2">没有检测</Option><Option value="254">异常</Option><Option value="256">无效</Option></Select>)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem {...formItemLayout} label="车辆熄火后，T-BOX延时休眠时间">
                {getFieldDecorator('0xAC', {rules: [
                ]})(<Input size="default"/>)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem {...formItemLayout} label="延时模式数据上报周期">
                {getFieldDecorator('0xAB', {rules: [
                ]})(<Input size="default"/>)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem {...formItemLayout} label="延时模式心跳上报周期">
                {getFieldDecorator('0xAA', {rules: [
                ]})(<Input size="default"/>)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem {...formItemLayout} label="休眠后，间隔上报定位周期">
                {getFieldDecorator('0xAE', {rules: [
                ]})(<Input size="default"/>)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem {...formItemLayout} label="出现三级报警时，数据上报周期">
                {getFieldDecorator('0x03', {rules: [
                  { message: '有效范围1000~60000整数', validator: this.checkIntegerRange.bind(null, [1000, 60000]) }
                ], initialValue: 1000})(<Input size="default" addonAfter="毫秒" />)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem {...formItemLayout} label="复位周期">
                {getFieldDecorator('0xAF', {rules: [
                ]})(<Input size="default"/>)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem {...formItemLayout} label="短信唤醒后，延时休眠时间">
                {getFieldDecorator('0xAD', {rules: [
                ]})(<Input size="default"/>)}
              </FormItem>
            </Col>
          </Row>
          <div className="choicedev" style={{justifyContent: "space-around"}}>
            <Popconfirm title="确定发送吗?" onConfirm={this.callSMS}>
              <Button type="primary" loading={this.state.callSMSL}>短信唤醒</Button>
            </Popconfirm>
            <Popconfirm title="确定发送吗?" onConfirm={this.sendDef}>
              <Button type="primary" loading={this.state.sendDefL}>下发复位</Button>
            </Popconfirm>
            <Popconfirm title="确定发送吗?" onConfirm={this.sendClose}>
              <Button type="primary" loading={this.state.calCloseL}>下发关机</Button>
            </Popconfirm>
            <Popconfirm title="确定发送吗?" onConfirm={this.paramSearch}>
              <Button type="primary" loading={this.state.paramSearchL}>参数查询</Button>
            </Popconfirm>
            <Popconfirm title="确定发送吗?" onConfirm={this.sendConfig}>
              <Button type="primary" loading={this.state.sendConfigL}>下发配置</Button>
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
}
const deviceParamAddForm = Form.create()(deviceParamAdd);
export default connect((state, p) => 
  ({ selectOrg: state.selectOrg }))(deviceParamAddForm);