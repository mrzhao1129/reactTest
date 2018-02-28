import React, { Component } from 'react';
import { Form, Button, DatePicker, Input, AutoComplete, Icon } from 'antd'
import moment from 'Moment';

import { url_getCar } from '../../utils/config/api'
import { Axios } from '../../interface'

/**
 * 历史数据、历史轨迹公用查询框
 * @class queryForm
 * @param {func} this.prpos.handleSubmit 查询回调函数
 * @param {func} this.prpos.download 下载回调函数
 * @param {String} this.prpos.queryVin 初始赋值Vin
 * @param {<String|Moment> Arr} this.prpos.queryRangeTime 初始赋值时间段
 * @extends {Component}
 */
class queryForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      vinDataSource: [],
      shouldGetVin: true,
    }
  }
  
  checkRangeTime = (rule, moment, callback) => {
    // console.log(rule, moment);
    moment.length === 2 && moment[1].valueOf() - moment[0].valueOf() > 604800000 ?
      callback('请选择小于一周的时间区间！') : callback();
  }
  hasErrors = (fieldsError) => {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
  }
  componentDidMount() {
    this.props.form.setFieldsValue({queryVin: this.props.queryVin || ''});
    this.props.queryRangeTime 
    ? this.props.form.setFieldsValue({queryRangeTime: 
        [moment(this.props.queryRangeTime[0]), moment(this.props.queryRangeTime[1])]}) : '';
  }
  vinOnChange = (e) => {
    if(this.state.shouldGetVin && 
      !this.state.vinDataSource.reduce(
        (t, v) => t || v.toUpperCase().indexOf(e.toUpperCase()) !== -1, false)) {
      this.state.shouldGetVin = false;
      Axios({
        url: url_getCar, 
        data: {
          id: '',
          orgId: '',
          vin: e,
          carTypeId: '',
          startTime: '',
          endTime: '',
          pageSize: 10,
          pageIndex: 1,
          orderBy: 'create_time',
          desc: 'desc',
        }
      }).then(res => {
        this.setState((prevState, props) => ({
          vinDataSource: res ? res.data.map(v => v.vin) : [],
          shouldGetVin: true,
        }));
      });
    }
    console.log(e);
  }
  render() {
    const { getFieldDecorator, getFieldsError, isFieldTouched, getFieldsValue, setFieldsValue } = this.props.form;
    // console.log(isFieldsTouched());
    //console.log('历史查询框:', this.props.queryVin, this.props.queryRangeTime);
    return (
      <Form layout="inline">
        <Form.Item>
          {getFieldDecorator('queryVin', {
            rules: [
              { required: true, message: '必填项！' },
            ],
            //initialValue: '008ZD2L0AH6230002'
          })(
            //<Input style={{ width: 200 }} placeholder="请输入VIN号、车主姓名或手机号" />
            <AutoComplete
              style={{ width: 200 }}
              dataSource={this.state.vinDataSource}
              placeholder="请输入VIN号"
              filterOption={(inputValue, option) => option.props.children.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1}
              onChange={this.vinOnChange}
            />
          )}   
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('queryRangeTime', {
            rules: [
              { type: 'array', required: true, message: '请选择时间区间！' },
              { message: '请选择小于一周的时间区间！', validator: this.checkRangeTime },
            ],
            //initialValue: [moment('2017-08-20 02:00:00'), moment('2017-08-25 02:00:00')],
          })(
            <DatePicker.RangePicker 
              showTime={{ format: 'HH:mm:ss' }}
              format="YYYY-MM-DD HH:mm:ss"
              placeholder={['开始时间', '结束时间']}
            />
          )}
        </Form.Item>
        <Form.Item>
          <Button.Group>
            <Button type="primary" icon="search" 
              //disabled={
                //this.hasErrors(getFieldsError()) 
                //|| !isFieldTouched('queryVin') 
                //|| !isFieldTouched('queryRangeTime')
                //false
              //}
              title="查询"
              onClick={this.props.handleSubmit.bind(null, {
                queryVin: getFieldsValue().queryVin, 
                queryRangeTime: [
                  getFieldsValue().queryRangeTime ? getFieldsValue().queryRangeTime[0] ? getFieldsValue().queryRangeTime[0].format('YYYY-MM-DD HH:mm:ss') : '' : '',
                  getFieldsValue().queryRangeTime ? getFieldsValue().queryRangeTime[1] ?getFieldsValue().queryRangeTime[1].format('YYYY-MM-DD HH:mm:ss') : '' : '',
                ]})
              }
            />
            <Button type="primary" icon="download" 
              //disabled={
                //this.hasErrors(getFieldsError()) 
                //|| !isFieldTouched('queryVin') 
                //|| !isFieldTouched('queryRangeTime')
                //false
              //}
              //disabled
              title="导出"
              onClick={this.props.download.bind(null, getFieldsValue())}
            />
          </Button.Group>
        </Form.Item>
      </Form>
    );
  }
}
const WrappedQueryForm = Form.create()(queryForm);

export default WrappedQueryForm;