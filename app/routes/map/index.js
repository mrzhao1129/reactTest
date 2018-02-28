import React, { Component } from 'react';
import { Select, Button, Row, Col } from 'antd';

const Option = Select.Option;

import './map.less';

class MapExp extends Component {
  componentDidMount() {
    // let map = new AMap.Map('AGDMap', {
    //     resizeEnable: true,
    //     zoom:11,
    //     center: [116.397428, 39.90923],
    // });
    // map.plugin(['AMap.DistrictSearch', "AMap.Scale", "AMap.ToolBar"], function() {
    //   var scale = new AMap.Scale();
    //   map.addControl(scale);
    //   // var tool = new AMap.ToolBar();
    //   // map.addControl(tool);
    // });
  }
  render() {
    return (
      <div style={{ position: "relative" }}>
        <div style={{ position: "absolute", width: 288, left: 0, 
          right: 0, top: 10, margin: "auto", zIndex: 100 }}>
          <Select defaultValue="lucy" style={{ width: 120, marginRight: 10 }} onChange={''}>
            <Option value="jack">Jack</Option>
            <Option value="lucy">Lucy</Option>
            <Option value="disabled" disabled>Disabled</Option>
            <Option value="Yiminghe">yiminghe</Option>
          </Select>
          <Select defaultValue="lucy" style={{ width: 120, marginRight: 10 }} onChange={''}>
            <Option value="jack">Jack</Option>
            <Option value="lucy">Lucy</Option>
            <Option value="disabled" disabled>Disabled</Option>
            <Option value="Yiminghe">yiminghe</Option>
          </Select>
          <Button type="primary" shape="circle" icon="search" />
        </div>
        <div style={{ position: "absolute", top: 10, left: 10, padding: 5, background: "white" }}>
          <header>车辆数目</header>
          <content>
            <span>行驶中：111</span><br />
            <span>在线：222</span><br />
            <span>离线：333</span><br />
            <span>总计：444</span>
          </content>
        </div>
        <div className="mapDiv" id="AGDMap"></div>
      </div>
    );
  }
}

export default MapExp;