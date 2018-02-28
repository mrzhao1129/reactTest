import React from 'react';
import { Form, Icon, Input, Button, Checkbox, message } from 'antd';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import Cookies from 'js-cookie';
import crypto from 'crypto-browserify';
import JSEncrypt from '../utils/js/jsencrypt.min';

import { insertEntry } from '../utils/storage.js';
import { Fetch, Axios } from '../interface';
import { initUserInfo } from '../actions';
import { userLogin, url_getPubKey, url_login, getPubKeyCode } from '../utils/config/api';

import './layout/login.less';

const FormItem = Form.Item;

class Login extends React.Component{
  constructor(...props) {
    super();
    this.state = {
      loading: false,
    };
    this.data = {
      pubKey: '',
    };
  }
  handleSubmit = (...event) => {
    const { dispatch } = this.props;
    console.log(this.props.form.getFieldsValue());
    //form测试
    this.props.form.validateFields(
      (err) => {
        if (!err) {
          const encrypt = new JSEncrypt();
          encrypt.setPublicKey(this.data.pubKey);
          this.setState({loading: true});
          Axios({
            url: url_login,
            code: getPubKeyCode,
            data: {
              account: this.props.form.getFieldValue('userName'),
              pwd: encrypt.encrypt(this.props.form.getFieldValue('password')).replace(/\+/g, '%2B'),
              phoneCode: '',
            }
          }).then(res => {
            if(res) {
              message.success('登录成功');
              this.props.form.getFieldValue('remember') 
                ? Cookies.set("Token", res.code, { expires: 7 })
                : Cookies.set("Token", res.code);

              const buttonRules = {};
              const buildMenuItems = (items) => {
                items.map((v, i, arr) => {
                  if(v.menu_url) {
                    buttonRules[v.menu_url.substr(1)] = v.children;
                  } else {
                    v.children ? buildMenuItems(v.children) : '';
                  }
                });
              }
              buildMenuItems(res.data[0].menu);
              //buttonRulesV2
              let buttonRulesV2 = {};
              const buttonRulesKeys = Object.keys(buttonRules);
              for(let key of buttonRulesKeys) {
                buttonRulesV2[key] = {};
                for(let ruleItem of buttonRules[key] || []) {
                  if(ruleItem.menu_name.indexOf('添加') + 1) {
                    buttonRulesV2[key]['addRule'] = ruleItem.is_use;
                  } else if (ruleItem.menu_name.indexOf('修改') + 1) {
                    buttonRulesV2[key]['editRule'] = ruleItem.is_use;
                  } else if (ruleItem.menu_name.indexOf('删除') + 1) {
                    buttonRulesV2[key]['delRule'] = ruleItem.is_use;
                  } else if (ruleItem.menu_name.indexOf('绑定') + 1) {
                    buttonRulesV2[key]['bindRule'] = ruleItem.is_use;
                  } else if (ruleItem.menu_name.indexOf('导入') + 1) {
                    buttonRulesV2[key]['impRule'] = ruleItem.is_use;
                  } else if (ruleItem.menu_name.indexOf('导出') + 1) {
                    buttonRulesV2[key]['expRule'] = ruleItem.is_use;
                  }
                }
              }
              dispatch(initUserInfo({...res.data[0], buttonRules, buttonRulesV2}));  
              // dispatch(initUserInfo(res.data[0]));
              this.props.history.push('/main/overview');
            }else {
              message.warning('登录失败');
            }
            this.setState({loading: false});
          });
        }
      },
    );
  }
  componentDidMount() {
    Axios({
      url: url_getPubKey,
      code: getPubKeyCode,
      data: {},
    }).then(res => {
      if(res) {
        this.data.pubKey = res.data[0].pubKey;
      }else {
        message.error("连接服务器失败！请刷新");
      }
    });
    document.onkeydown = e => {
      const theEvent = window.event || e;
      const code = theEvent.keyCode || theEvent.which;
      if (code == 13 && !this.state.loading) {
        this.refs.submit.props.onClick();
      }
    }
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div style={{height: '100%', overflow: 'hidden'}}>
        <div className="login-bg-div"></div>
        <div className="login-div">
          <p className="title">车辆信息服务管理平台</p>
          <Form className="login-form" id="loginForm" onSubmit={
            e => {
              console.log(e);
              console.log(this.props.form.getFieldsValue());
              e.preventDefault();
              return false;
            }
          }>
            <FormItem>
              {getFieldDecorator('userName', {
                rules: [{ required: true, message: '请输入您的用户名!' }],
              })(
                <Input name="user" prefix={<Icon type="user" style={{ fontSize: 13 }} />} placeholder="用户名" />
              )}
            </FormItem>
            <FormItem>
              {getFieldDecorator('password', {
                rules: [{ required: true, message: '请输入您的密码!' }],
              })(
                <Input name="pass" prefix={<Icon type="lock" style={{ fontSize: 13 }} />} type="password" placeholder="密码" />
              )}
            </FormItem>
            <FormItem>
              {getFieldDecorator('remember', {
                valuePropName: 'checked',
                initialValue: true,
              })(
                <Checkbox>记住我</Checkbox>
              )}
              {/* <a className="login-form-forgot" href="">忘记密码</a> */}
              <Button type="primary" htmlType="button" loading={this.state.loading} 
                ref="submit"
                className="login-form-button" 
                onClick={this.handleSubmit}>
                登录
              </Button>
              {/* 或 <a href="">注册!</a> */}
            </FormItem>
          </Form>
        </div> 
      </div>
    );
  }
}

const LoginForm = Form.create()(Login);
export default connect(
  (state, p) => {
    return {};
  }
)(LoginForm);
// export default Login;