//标准模态框，输入数组生成模态框(添加/修改) standModal
//{
//  label: '组织编号', 
//  type: <Input />, 
//  key: 'orgCode', 
//  init: this.getEditItem('org_code'), 
//  rules: [
//    {message: '2位大写字母或数字', required: true, validator: (r, v, c) => /^[A-Z|0-9]*$/g.test(v) && v.length === 2 ? c() : c(false)},
//  ]，
//  span: 10
//}
import React, { Component } from 'react';
import { Modal, Form, Row, Col } from 'antd';
import crypto from 'crypto-browserify';
import moment from 'moment';

import '../../routes/layout/style.less';

const { Item: FormItem } = Form;
const formItemLayout = {
  labelCol: { span: 10 },
  wrapperCol: { span: 14 },
};
class standModal extends Component {
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Modal
        title={this.props.title}
        visible={this.props.visible}
        onOk={this.getFieldsValue}
        onCancel={this.props.onCancel}
        className="standModal"
        maskClosable={false}
        style={this.props.style}
        confirmLoading={this.props.confirmLoading}
      >
        <Row gutter={24} className="addForm">
          {
            this.props.children.map((value, key) => 
              <Col span={value.span || 12} key={value.key}>
                <FormItem {...formItemLayout} label={value.label}>
                  {getFieldDecorator(value.key, 
                    this.state.getFieldDecoratorObjs[key]
                  )(
                    value.type
                  )}
                </FormItem>
              </Col>
            )
          }
        </Row>
      </Modal>
    );
  }
  componentDidMount() {
    this.checkChildrens();
  }
  constructor(props) {
    super(props);
    this.state = {
      getFieldDecoratorObjs: [],
    }
  }
  getFieldsValue = () => {
    this.props.form.validateFields(err => {
      if (!err) {
        const values = this.props.form.getFieldsValue();
        this.props.onOk(values);
      }
    });
    // const values = this.props.form.getFieldsValue();
    // this.props.onOk(values);
  }
  checkChildrens = () => {
    const items = this.props.children.map(({label, type, key, ...others}, i) => {
      let item = {};
      for(const key of Object.keys(others)) {
        if(key === 'init'){
          typeof others.init !== 'undefined' ? item.initialValue = others.init : '';
          continue;
        }
        others[key] ? item[key] = others[key] : '';
      }
      return item;
    })
    this.setState({getFieldDecoratorObjs: items})
  }
}
const standModalForm = Form.create()(standModal)
export default standModalForm;