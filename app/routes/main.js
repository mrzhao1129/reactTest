import React from 'react';
import { Layout, Icon, Avatar, Popover, message } from 'antd';
import { Scrollbars } from 'react-custom-scrollbars';
import Cookies from 'js-cookie';
import { connect } from 'react-redux';

import { Breadcrumb, Sidebar, UserHeadIcon } from '../components';
import { Axios } from '../interface';
import { url_loginByToken } from '../utils/config/api';
import { initUserInfo } from '../actions';

import './layout/main.less';

const { Header, Content, Footer, Sider } = Layout;

class Main extends React.Component {
  constructor() {
    super();
    this.state = {
      breadcrumb: "/概览",
      collapsed: false,
    }
  }
  setBreadcrumb = (url) => {
    this.setState({breadcrumb: url});
  }
  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  }
  componentWillMount = async () => {
    const { dispatch } = this.props;

    if(!Cookies.get('Token')){
      this.props.history.push('/login');
    }else if(!this.props.userInfo.account){
      const res = await Axios({
        url: url_loginByToken,
        data: {},
      });
      if(res){
        message.success('无密登录成功');

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
      }else {
        message.warning('登录失败');
      }
    }
  }
  componentDidMount = () => {};
  render() {
    return (
      <Layout>
        <Sider
          collapsedWidth="0"
          trigger={null}
          onCollapse={(collapsed, type) => { console.log(collapsed, type); }}
          collapsed={this.state.collapsed}
          style={{ height: "100%" }}
        >
          <Scrollbars autoHide style={{ height: "100%" }}> 
            {/* <div className="logo" style={{backgroundImage: `url(${require('../utils/img/0.jpg')})`, boxShadow: '2px 2px 5px'}}></div>    */}
            <div className="logo" style={{background: `url(${this.props.userInfo.logo_url || ''}) no-repeat 100%/100%`, boxShadow: '2px 2px 5px'}}></div>   
            {/* <img className="logo" src={require('../utils/img/0.jpg')} />   */}
            <Sidebar match={ this.props.match } setBreadcrumb={ this.setBreadcrumb }></Sidebar>
          </Scrollbars>
          {/* <footer style={{ height: '42px', background: 'rgb(16, 142, 233)', textAlign: 'center', 
              lineHeight: '42px'}}>test</footer>  */}
        </Sider>
        <Layout>
          <Header className="header">
            <Icon
              className="trigger"
              type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
              onClick={this.toggle}
            />
            {/* <span className="title">{this.props.userInfo.sys_name}</span> */}
            <UserHeadIcon history={this.props.history}/>
          </Header>
          <Breadcrumb breadcrumb={ this.state.breadcrumb } />
          <Content className="content" style={{overflow: "auto"}}>
            {this.props.children}
          </Content>
          <Footer className="footer" title="︿(￣︶￣)︿ code by Alan">
            ©2017 {this.props.userInfo.org_name}
          </Footer>
        </Layout>
      </Layout>
    );
  }
}
const Home = () => (
  <div>
    <h2>首页</h2>
  </div>
)
export default connect((state, props) => ({userInfo: state.userInfo}))(Main);