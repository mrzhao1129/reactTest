import React from 'react';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';
import Cookies from 'js-cookie';
// import {  } from 'react-router';

import Main from './main';
import IndexTest2 from './indexTest2';
import Login from './login';
import NotFind from './404';
import { Log } from './app';
import Exp from './exp';
import MapExp from './map';
import { getAll, getEntry } from '../utils/storage.js';
import Bundle from '../utils/config/bundle';
import {
  // Overview,
  HisPath, RealSite,
  RealData, HisData, AlertManage,
  HisDataDirectSet, HisDataInDirectSet,
  //生产管理
  carProd, tBoxProd, 
  //信息中心
  DeviceInfo, DeviceParam, DeviceUpdate, GroupMag, SimCharts, SimMag, CarMag, CarFacMag, CarTypeMag,
  //APP管理
  UserMag, ControlMag, AppUpdate, SetMag,
  //用户管理
  AccountMag, PartMag,
  //系统管理
  DicMag, MenuMag, OrgMag, ParamMag, RuleMag, SysLog, SysMag, disDevideMag,
  //ota管理
  OtaDev, OtaVerRule, OtaReqLog, OtaEditLog,
  //设备管理
  HwVer, SwVer, OTADevInfo
} from './index';

const Overview = (url, props) => (
  <Bundle load={() => import('./overview')}>
    {Overview => <Overview {...props} />}
  </Bundle>
);

const hasUserInfo = () => {
  let ssObj = {};
  getAll().then(val => {return val.length > 0 ? true : false});
}

const App = () => {
  return(
    <BrowserRouter>
      <div>
      <Switch>
        <Route exact path="/" render={props => 
          Cookies.get('Token') ?
            <Redirect to="/main/overview" />
            : <Redirect to="/login" />
        } />
        <Route path="/login" render={props => <Login {...props} />} />
        <Route path="/main" render={props => 
            <Main {...props}>
              {/* <Redirect to="/main/overview" /> */}
              <Switch>
                {/*----------test--start----------*/}
                <Route path={ `${props.match.url}/test1` }  component={ IndexTest2 } />
                <Route path={ `${props.match.url}/test2` } component={ NotFound } />
                <Route path={ `${props.match.url}/appLog` } component={ Log } />
                <Route path={ `${props.match.url}/exp` } component={ Exp } />
                <Route path={ `${props.match.url}/mapExp` } component={ MapExp } />
                {/*----------test--end----------*/}
                {/* 概览 */}
                {/* <Route path={ `${props.match.url}/overview` } component={ Overview } /> */}
                <Route path={ `${props.match.url}/overview` } component={ Bundle(() => import('./overview')) } />
                {/* 监控中心 */}
                <Route path={ `${props.match.url}/realSite` } component={ RealSite } />
                <Route path={ `${props.match.url}/hisPath` } component={ HisPath } />
                <Route path={ `${props.match.url}/realData` } component={ RealData } />
                <Route path={ `${props.match.url}/hisData` } component={ HisData } />
                <Route path={ `${props.match.url}/alertManage` } component={ AlertManage } />
                <Route path={ `${props.match.url}/directSet` } component={ HisDataDirectSet } />
                <Route path={ `${props.match.url}/indirectSet` } component={ HisDataInDirectSet } />
                {/* 生产管理 */}
                <Route path={ `${props.match.url}/carProd` } component={ carProd } />
                <Route path={ `${props.match.url}/tBoxProd` } component={ tBoxProd } />
                {/* 信息中心 */}
                <Route path={ `${props.match.url}/devInfo` } component={ DeviceInfo } />
                <Route path={ `${props.match.url}/devParam` } component={ DeviceParam } />
                <Route path={ `${props.match.url}/devUpdate` } component={ DeviceUpdate } />
                <Route path={ `${props.match.url}/groupMag` } component={ GroupMag } />
                <Route path={ `${props.match.url}/simMag` } component={ SimMag } />
                <Route path={ `${props.match.url}/simCharts` } component={ SimCharts } />
                <Route path={ `${props.match.url}/carMag` } component={ CarMag } />
                <Route path={ `${props.match.url}/carFacMag` } component={ CarFacMag } />
                <Route path={ `${props.match.url}/carTypeMag` } component={ CarTypeMag } />
                {/* APP管理 */}
                <Route path={ `${props.match.url}/userMag` } component={ UserMag } />
                <Route path={ `${props.match.url}/controlMag` } component={ ControlMag } />
                <Route path={ `${props.match.url}/setMag` } component={ SetMag } />
                <Route path={ `${props.match.url}/appUpdate` } component={ AppUpdate } />
                {/* 用户管理 */}
                <Route path={ `${props.match.url}/accountMag` } component={ AccountMag } />
                <Route path={ `${props.match.url}/partMag` } component={ PartMag } />
                {/* 系统管理 */}
                <Route path={ `${props.match.url}/dicMag` } component={ DicMag } />
                <Route path={ `${props.match.url}/menuMag` } component={ MenuMag } />
                <Route path={ `${props.match.url}/orgMag` } component={ OrgMag } />
                <Route path={ `${props.match.url}/paramMag` } component={ ParamMag } />
                <Route path={ `${props.match.url}/ruleMag` } component={ RuleMag } />
                <Route path={ `${props.match.url}/sysLog` } component={ SysLog } />
                <Route path={ `${props.match.url}/sysMag` } component={ SysMag } />
                <Route path={ `${props.match.url}/disDevideMag` } component={ disDevideMag } />
                {/* ota管理 */}
                <Route path={ `${props.match.url}/otaDev` } component={ OtaDev } />
                <Route path={ `${props.match.url}/otaVerRule` } component={ OtaVerRule } />
                <Route path={ `${props.match.url}/otaReqLog` } component={ OtaReqLog } />
                <Route path={ `${props.match.url}/otaEditLog` } component={ OtaEditLog } />
                {/* 设备管理 */}
                <Route path={ `${props.match.url}/hwVer` } component={ HwVer } />
                <Route path={ `${props.match.url}/swVer` } component={ SwVer } />
                <Route path={ `${props.match.url}/OTADevInfo` } component={ OTADevInfo } />
                <Route component={ NotFound } />
              </Switch>
            </Main>
        } />
        <Route component={ NotFound } />
      </Switch>
      </div>
    </BrowserRouter>
  );
}

const NotFound = () => (
  <div>
    <h2 style={{textAlign: "center"}}>404 not found !</h2>
  </div>
)

export default App;