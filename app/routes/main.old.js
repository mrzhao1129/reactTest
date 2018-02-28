import React from 'react';
import { Layout } from 'antd';
import { Route } from 'react-router-dom';

// import Main from './main';
import Index from './index';

import Sidebar from '../components/sidebar';
import './layout/main.less';

const { Header, Content, Footer, Sider } = Layout;

class Main extends React.Component {
  constructor() {
    super();
  }
  render() {
    console.log(this.props.match);
    return (
      <Layout>
        <Sider
          breakpoint="lg"
          collapsedWidth="0"
          onCollapse={(collapsed, type) => { console.log(collapsed, type); }}
        >
          <div className="logo" />
          <Sidebar></Sidebar>
          <footer style={{ height: '50px', background: '#005691', bottom: 0 }}></footer>
        </Sider>
        <Layout>
          <Header style={{ background: '#fff', padding: 0 }}>Test</Header>
          <Content style={{ margin: '24px 16px 0' }}>
            <div style={{ padding: 24, background: '#fff', minHeight: 600 }}>
              <Route exact path="/test1" component={ Home }/>
              <Route exact path="/test2" component={ Index }/>
            </div>
          </Content>
          <Footer style={{ textAlign: 'center' }}>
            Ant Design ©2016 Created by Ant UED
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
export default Main;