import React, { Component } from 'react';
import { Popover, Avatar, Icon, Modal, Input, Form, message } from 'antd';
import { Redirect, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import JSEncrypt from '../../utils/js/jsencrypt.min';

import { Axios } from '../../interface';
import { url_upPass, url_getPubKey, getPubKeyCode } from '../../utils/config/api';
import { MoreModal } from '../../components';

const { Item: FormItem } = Form;
const formItemLayout = {
  labelCol: { span: 10 },
  wrapperCol: { span: 14 },
};
// const popList = (
//   <dl className="userList">
//     <dt><span><Icon type="close"/><span> 注销</span></span></dt>
//     <dt onClick={() => this.setState({changePassVisible: true})}><span><Icon type="key"/><span> 修改密码</span></span></dt> 
//     <dt><span><Icon type="info"/><span> Info Test</span></span></dt> 
//   </dl>
// );
class userHeadIcon extends Component {
  constructor(props) {
    super(props);
    this.state = {
      changePassVisible: false,
      aboutUsVisible: false,
      userInfoVisible: false,
    } 
  }
  render() {
    return (
      <div>
        <Popover placement="bottomRight" content={
          <dl className="userList">
            <dt onClick={() => {
              // this.props.history.push('/login');
              window.location.href='/login';
            }}><span><Icon type="close"/><span>更换用户</span></span></dt>
            <dt onClick={() => this.setState({changePassVisible: true})}><span><Icon type="key"/><span>修改密码</span></span></dt> 
            <dt onClick={() => this.setState({userInfoVisible: true})}><span><Icon type="smile-o"/><span>用户信息</span></span></dt> 
            <dt><span><Icon type="book"/><span>操作手册</span></span></dt> 
            <dt onClick={() => Modal.info({title: "version: 1.0.0 20171027", content: "Bug反馈: 2827322474@qq.com"})}><span><Icon type="question-circle-o"/><span>About us</span></span></dt>
          </dl>
        } trigger="click"> 
          <div className="userDiv">
            <Avatar src={require('../../utils/img/0.jpg')} className="userHead" />
            <span>Hi!  {this.props.userInfo.nick_name}</span>
          </div>
        </Popover>
        <ChangePassForm
          key={Math.random()}
          visible={ this.state.changePassVisible }
          onCancel={() => this.setState({changePassVisible: false})} 
          userInfo={this.props.userInfo}
        ></ChangePassForm>
        <MoreModal title="个人信息" visible={this.state.userInfoVisible}
          onCancel={() => this.setState({userInfoVisible: false})}
        >
          {[
            {label: '账号', init: this.props.userInfo.account}, 
            {label: '地址', init: this.props.userInfo.address}, 
            {label: '生日', init: this.props.userInfo.birthday}, 
            {label: '创建时间', init: this.props.userInfo.create_time}, 
            {label: '创建人', init: this.props.userInfo.creator}, 
            {label: '修改时间', init: this.props.userInfo.edit_time}, 
            {label: '修改人', init: this.props.userInfo.editor}, 
            {label: '邮箱', init: this.props.userInfo.email}, 
            {label: '报警数量', init: this.props.userInfo.error_count}, 
            {label: '其他信息', init: this.props.userInfo.extra_info}, 
            {label: '分组', init: this.props.userInfo.group_name},
            {label: '爱好', init: this.props.userInfo.hobby}, 
            {label: '编号', init: this.props.userInfo.id}, 
            {label: '管理员', init: this.props.userInfo.is_admin}, 
            {label: '名称', init: this.props.userInfo.name}, 
            {label: '简称', init: this.props.userInfo.nick_name}, 
            {label: '部门', init: this.props.userInfo.org_name}, 
            {label: '手机号', init: this.props.userInfo.phone}, 
            {label: 'QQ', init: this.props.userInfo.qq}, 
            {label: '权限', init: this.props.userInfo.role_name}, 
            {label: '性别', init: this.props.userInfo.sex}, 
          ]}
        </MoreModal>
      </div>
    );
  }
}
class ChangePass extends Component {
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Modal 
        title="修改密码"
        width={ 300 }
        visible={ this.props.visible }
        onOk={ this.changePassSubmit }
        onCancel={ this.props.onCancel }
        className="standModal"
        maskClosable={false}
        confirmLoading={this.state.confirmLoading}
      >
      <div style={{overflow: "hidden"}}>
        <FormItem {...formItemLayout} label="账号或手机号">
          {getFieldDecorator('phone', { rules: [
            { message: '必填项', required: true }
          ], initialValue: this.props.userInfo.account})(<Input size="default" readOnly/>)}
        </FormItem>
        <FormItem {...formItemLayout} label="旧密码">
          {getFieldDecorator('oldPass', { rules: [
            { message: '必填项', required: true }
          ]})(<Input size="default"/>)}
        </FormItem>
        <FormItem {...formItemLayout} label="新密码">
          {getFieldDecorator('newPass', { rules: [
            { message: '必填项', required: true }
          ]})(<Input size="default"/>)}
        </FormItem>
        <FormItem {...formItemLayout} label="再输一次">
          {getFieldDecorator('newPassAgain', { rules: [
            { message: '必填项', required: true },
            { message: '与上次输入不同', validator: (r, v, c) => this.props.form.getFieldValue('newPass') === v ? c() : c(false) },
          ]})(<Input size="default"/>)}
        </FormItem>
      </div>
      </Modal>
    );
  }
  constructor(props) {
    super(props);
    this.state = {
      confirmLoading: false,
    }
  }
  
  changePassSubmit =  () => {
    this.props.form.validateFields(
      async (err) => {
        if (!err) {
          this.setState({confirmLoading: true});
          const pubK = await Axios({url: url_getPubKey, code: getPubKeyCode,data: {},});
          if(pubK) {
            const pubKey = pubK.data[0].pubKey;
            //加密
            const encrypt = new JSEncrypt();
            encrypt.setPublicKey(pubKey);
            const getFieldValue = this.props.form.getFieldValue;
            const cpr = await Axios({
              url: url_upPass,
              data: {
                account: getFieldValue('phone'),
                oldPwd: encrypt.encrypt(getFieldValue('oldPass')).replace(/\+/g, '%2B'),
                newPwd: encrypt.encrypt(getFieldValue('newPassAgain')).replace(/\+/g, '%2B'),
                phoneCode: '',
              }
            });
            if(cpr){
              message.success('修改成功！');
              this.props.onCancel();
            }else {
              message.error('修改失败！');
            }
          }else {
            message.error('修改失败！');
          }
          this.setState({confirmLoading: false});
          console.log(this.props.form.getFieldsValue());
        }
      }
    );
  }
  componentDidMount() {
    //console.log('change pass');
  }
}
const ChangePassForm = Form.create()(ChangePass);
export default connect((state, props) => ({userInfo: state.userInfo}))(userHeadIcon);