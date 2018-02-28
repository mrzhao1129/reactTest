import React from 'react';
import { Menu, Icon } from 'antd';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

//import MenuItems from '../../utils/config/menu';
// import { initUserInfo } from '../../actions';

const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

class Sidebar extends React.Component {
  constructor() {
    super();
    this.state = {
      current: '1',
      // openKeys: [],
      buttonRules: {},
    };
  }
  handleClick = (e) => {
    this.setState({ current: e.key });
  };
  // onOpenChange = (openKeys) => {
  //   console.log(openKeys);
  //   const state = this.state;
  //   const latestOpenKey = openKeys.find(key => !(state.openKeys.indexOf(key) > -1));
  //   const latestCloseKey = state.openKeys.find(key => !(openKeys.indexOf(key) > -1));
  //   console.log(latestOpenKey);
  //   console.log(latestCloseKey);
  //   let nextOpenKeys = [];
  //   if (latestOpenKey) {
  //     nextOpenKeys = this.getAncestorKeys(latestOpenKey).concat(latestOpenKey);
  //   }
  //   if (latestCloseKey) {
  //     nextOpenKeys = this.getAncestorKeys(latestCloseKey);
  //   }
  //   console.log(nextOpenKeys)
  //   this.setState({ openKeys: nextOpenKeys });
  //   // this.state.openKeys = nextOpenKeys;
  // }
  // getAncestorKeys(key) {
  //   // const map = {
  //   //   sub3: ['sub2'],
  //   //   '0201': ['02'],
  //   //   '0205': ['02'],
  //   //   '0504': ['05'],
  //   //   '0505': ['05'],
  //   // };
  //   // return map[key] || [];
  //   return key.length === 4 ? [key.substr(0, 2)] : [];
  // }

  /**
   * @param {array[object]} itemsArr 传入菜单JSON对象 
   * @param {string} [breadcrumbStr=''] 
   * @returns 
   * @memberof Sidebar
   */
  // buildMenu(itemsArr, breadcrumbStr = ''){
  //   return itemsArr.map((v, i, arr) => {
  //     const breadcrumbNow = breadcrumbStr + '/' + v.name;
  //     return (
  //       v.link ? (
  //         <Menu.Item key={ v.key }>
  //           <Link to={ `${this.props.match.url + v.link}` } 
  //             onClick={this.props.setBreadcrumb.bind(null, breadcrumbNow)}>
  //             { v.icon ? <Icon type={ v.icon } /> : '' }{ v.name }
  //           </Link>
  //         </Menu.Item> 
  //       ) : (
  //         <SubMenu 
  //           key={ v.key } 
  //           title={ v.icon ? (<span><Icon type={ v.icon }/>{ v.name }</span>
  //             ) : (v.name) 
  //           }
  //         >
  //           { this.buildMenu(v.childs, breadcrumbNow) }
  //         </SubMenu> 
  //       )
  //     );  
  //   });
  // }
  buildMenuItems = (items, breadcrumbStr = '') =>  {
    return items.map((v, i, arr) => {
      const breadcrumbNow = breadcrumbStr + '/' + v.menu_name;
      if(v.menu_url) {
        this.state.buttonRules[v.menu_url.substr(1)] = v.children;
        return <Menu.Item key={ v.id }>
          <Link to={ `${this.props.match.url + v.menu_url}` }
            onClick={this.props.setBreadcrumb.bind(null, breadcrumbNow)}>
            { v.pic_id ? <Icon type={ v.pic_id } /> : '' }{ v.menu_name }
          </Link>
        </Menu.Item>;
      } else {
        return <SubMenu key={ v.id }
          title={ v.pic_id ? (<span><Icon type={ v.pic_id }/>{ v.menu_name }</span>
            ) : (v.menu_name) }>
          { v.children ? this.buildMenuItems(v.children, breadcrumbNow) : '' }
        </SubMenu>;
      }
    });
  }
  render() {
    return (
      <Menu
        theme="dark"
        onClick={this.handleClick}
        defaultSelectedKeys={['01']}
        //defaultOpenKeys={['sub1', 'sub2','sub4',]}
        mode="inline"
        //openKeys={this.state.openKeys}
        //onOpenChange={this.onOpenChange}
      >
        {/* { this.buildMenu(MenuItems) } */}
        { this.props.userInfo && this.props.userInfo.menu ? this.buildMenuItems(this.props.userInfo.menu) : '' }
        {/*----------start----------*/}
        {/* <SubMenu key="sub1" title={<span><Icon type="mail" />[Test]-Exp</span>}>
          <MenuItemGroup key="g1" title="Exp">
            <Menu.Item key="1"><Link to={ `${this.props.match.url}/exp` }>Exp</Link></Menu.Item>
            <Menu.Item key="2"><Link to={ `${this.props.match.url}/mapExp` }>AMap</Link></Menu.Item>
          </MenuItemGroup>
        </SubMenu>
        <SubMenu key="sub2" title={<span><Icon type="appstore" /><span>[Test]-App管理</span></span>}>
          <Menu.Item key="5"><Link to={ `${this.props.match.url}/appLog` }>日志查询</Link></Menu.Item>
          <Menu.Item key="6">Option 6</Menu.Item>
          <SubMenu key="sub3" title="Submenu">
            <Menu.Item key="7">Option 7</Menu.Item>
            <Menu.Item key="8">Option 8</Menu.Item>
          </SubMenu>
        </SubMenu>
        <SubMenu key="sub4" title={<span><Icon type="setting" /><span>[Test]-系统管理</span></span>}>
          <Menu.Item key="9">账户管理</Menu.Item>
          <Menu.Item key="10">角色管理</Menu.Item>
          <Menu.Item key="11">菜单管理</Menu.Item>
          <Menu.Item key="12">系统日志</Menu.Item>
        </SubMenu> */}
        {/*----------end----------*/}
      </Menu>
    );
  }
}

export default connect((state, props) => ({userInfo: state.userInfo}))(Sidebar);