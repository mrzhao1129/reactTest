//概览
import React, { Component } from 'react';
import { Select, Button, Row, Col, Badge, Spin, Input, Table, Modal } from 'antd';
import axios from 'axios';
// import echarts from 'echarts';
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/bar';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/legend';
// import { points } from '../../utils/js/china.js';
import { connect } from 'react-redux';

import { Axios, wgsTOgcj } from '../../interface'
import { getSelectOrg } from '../../actions';
import { url_getType, url_getCarStateByTol, url_getCarStateByCity } from '../../utils/config/api';
//import standPage from '../../components/standPage';
import { RealSite } from '../index';

const { Option } = Select;
const columns = [{
  title: '行政区',
  dataIndex: 'district',
  width: 140,
}, {
  title: '行驶中',
  dataIndex: 'run',
}, {
  title: '在线',
  dataIndex: 'online',
}, {
  title: '离线',
  dataIndex: 'outline',
}];
class Overview extends Component {
  constructor(props) {
    super(props);
    this.state = {
      totalOnLine: 0,
      totalNotOnLine: 0,
      totalOnDrive: 0,

      loading: false,
      chartDisplay: "none",
      hideBtnText: '<',

      allDatas: [],//国、省数据
      carTypeSelect: [],//车型select框数据

      realSiteVisible: false,
      realSiteVin: '',
    };
    this.data = {
      GDMap: new Object(),
      infoWindow: new Object(),
      allDatas: [],//国、省、市数据
      countryMarkers: [],//国Markers
      provinceMarkers:[],
      cityMarkers: [],
      carMarkers: [],

      carFactory: '',
      carType: '',
    };
  } 
  componentWillMount() {}
  componentDidMount() {
    let map = this.data.GDMap = new AMap.Map('AGDMap', {
        resizeEnable: true,
        center:[105,34],
        zoom: 4
    });
    map.plugin(['AMap.DistrictSearch', "AMap.Scale", "AMap.ToolBar"], function() {
      var scale = new AMap.Scale();
      map.addControl(scale);
      var tool = new AMap.ToolBar({offset: new AMap.Pixel(10, 130)});
      map.addControl(tool);
    });
    this.getDatas();
    const infoWindow = this.data.infoWindow = new AMap.InfoWindow({
      isCustom: true,
      offset: new AMap.Pixel(75, -30),
    });
    document.getElementById('AGDMap').onclick = (e) => {
      if(e.target.className === 'close') {
        this.data.infoWindow.close();
      }
    };
    document.getElementById('AGDMap').addEventListener('click', (e) => {
      if(e.target.tagName === "BUTTON"){
        console.log(this, e);
        this.setState({realSiteVin: e.target.getAttribute('data-vin'), realSiteVisible: true});
      }
    });
    //获取车厂下拉
    const dispatch = this.props.dispatch;
    dispatch(getSelectOrg());
  }
  test = () => {
    this.data.GDMap.remove(this.data.countryMarkers);
    this.data.GDMap.remove(this.data.provinceMarkers);
    this.data.GDMap.remove(this.data.cityMarkers);
    this.data.countryMarkers = [];
    this.data.provinceMarkers = [];
    this.data.cityMarkers = [];
    this.data.GDMap.setZoomAndCenter(4, [105,34]);
    this.getDatas();
  }
  getDatas = async () => {
    this.setState({loading: true});
    ///////////////////////////////////////////////
    // let alls = await axios.get('/api/overview2')
    //   .then(response => response.data)
    //   .catch(({...err}) => console.log(err));
    ///////////////////////////////////////////////
    let allsReal = await Axios({
      url: url_getCarStateByTol,
      data: {
        orgId: this.data.carFactory,
        carTypeId: this.data.carType,
      }
    });
    if(allsReal){
      this.data.allDatas = allsReal.data[0].children;
      this.setState({
        allDatas: allsReal.data[0].children, 
        totalOnLine: allsReal.data[0].children[0].online, 
        totalNotOnLine: allsReal.data[0].children[0].outline, 
        totalOnDrive: allsReal.data[0].children[0].run,
      });
      this.setCharts(allsReal.data[0].children);
      this.setMarkers();
      AMap.event.addListener(this.data.GDMap,'zoomend', this.zoomChange);
    } else {
      this.setState({allDatas: []});
    }
    this.setState({loading: false});
  }
  setCharts = (allDatas) => {
    const preData = allDatas;
    const provArr = preData[0].children.map((v, i) => v.district);
    const onlineArr = preData[0].children.map((v, i) => v.online);
    const onlineObj = { name: '在线', type: 'bar', stack: '车辆', data: onlineArr };
    const offlineArr = preData[0].children.map((v, i) => v.outline);
    const offlineObj = { name: '离线', type: 'bar', stack: '车辆', data: offlineArr };
    var myChart = echarts.init(this.refs.chart);
    myChart.setOption({
      title: { text: '各省在线、离线数据' },
      tooltip: {
        trigger: 'axis',
        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        }
      },
      legend: { data: ['在线', '离线'] },
      xAxis: {
        axisLabel: { interval: 0, rotate: -45 },
        data: provArr
      },
      yAxis: {},
      series: [onlineObj, offlineObj],
      color: ['#00a854', '#d9d9d9'],
    });
  }
  setMarkers = () => {
    const allDatas = this.state.allDatas;
    for(let country of allDatas) {
      this.data.countryMarkers.push(this.getMarker(country, 0));
      if(typeof country.children !== 'undefined' && country.children.length > 0){
        for(let prov of country.children){
          this.data.provinceMarkers.push(this.getMarker(prov, 1));
          if(typeof prov.children !== 'undefined' && prov.children.length > 0){
            for(let city of prov.children){
              this.data.cityMarkers.push(this.getMarker(city, 2));
            }
          }
        }
      } 
    }
    this.data.GDMap.add(this.data.countryMarkers);
  }
  addCountryMarkers = () => {
    this.data.GDMap.add(this.data.countryMarkers);
    this.data.GDMap.remove(this.data.provinceMarkers);
    this.data.GDMap.remove(this.data.cityMarkers);
    this.data.GDMap.remove(this.data.carMarkers);
  }
  addProvinceMarkers = () => {
    this.data.GDMap.remove(this.data.countryMarkers);
    this.data.GDMap.add(this.data.provinceMarkers);
    this.data.GDMap.remove(this.data.cityMarkers);
    this.data.GDMap.remove(this.data.carMarkers);
  }
  addCityMarkers = () => {
    this.data.GDMap.remove(this.data.countryMarkers);
    this.data.GDMap.remove(this.data.provinceMarkers);
    this.data.GDMap.add(this.data.cityMarkers);
    this.data.GDMap.remove(this.data.carMarkers);
  }
  addCarMarkers = () => {
    this.data.GDMap.remove(this.data.countryMarkers);
    this.data.GDMap.remove(this.data.provinceMarkers);  
    this.data.GDMap.remove(this.data.cityMarkers);
    this.data.GDMap.add(this.data.carMarkers);
  }
  getMarker = (district, level) => {
    const num = district.online + district.outline;
    let icon = '';
    let zoom;
    if (num <= 300) {
      icon = 'm0';
    } else if (num <= 500) {
      icon = 'm1';
    } else if (num <= 700) {
      icon = 'm2';
    } else if (num <= 900) {
      icon = 'm3';
    } else {
      icon = 'm4';
    }
    if (level == 0) {
      zoom = 5;
    } else if (level == 1) {
      zoom = 7;
    } else {
      zoom = 11;
    }
    const marker =  new AMap.Marker({
      position: [district.longitude, district.latitude],
      //offset: new AMap.Pixel(-50, -50),
      content: '<div class="' + icon + '">' + num + '</div>'
    });
    marker.on('click', () => {
      this.data.GDMap.setZoomAndCenter(zoom, marker.getPosition());
    })
    return marker;
  }
  zoomChange = () => {
    let zoom_now = this.data.GDMap.getZoom();
    console.log('zoom_now:', zoom_now);
    if(zoom_now <= 4){//国
      this.addCountryMarkers();
    }else if(zoom_now >= 5 && zoom_now <= 6){//省
      this.addProvinceMarkers();
    }else if(zoom_now >= 7 && zoom_now <= 10) {//市
      this.addCityMarkers();
    }else {//获取详细车辆信息
      this.data.GDMap.remove(this.data.carMarkers);
      this.getCarDatas();
    }
  }
  getCarDatas = async () => {
    this.setState({ loading: true });
    //获取城市信息
    this.data.GDMap.getCity(data => {
      Axios({
        url: url_getCarStateByCity,
        data: {
          orgId: this.data.carFactory,
          carTypeId: this.data.carType,
          city: data.city ? data.city : data.province,
        }
      }).then(res => {
        if(res) {
          this.data.carMarkers ? this.data.GDMap.remove(this.data.carMarkers) : '';
          this.data.carMarkers = res.data.map(v => this.getCarMarker(v)); 
        }
        this.addCarMarkers();
        this.setState({ loading: false });
      });
    });
    // let carDatas = await axios({
    //   url: '/api/overviewCar', 
    //   params: {
    //     city: "datong"
    //   },
    // })
    
    // carDatas = carDatas.data;
    // ////////////////////////////////////
    // console.log(carDatas);
    
    
    
  }
  getCarMarker = (district) => {
    let icon = {1: 'blv', 0: 'bhui', '': 'bhui'}[district.online] + '.png';
    const GCJ = wgsTOgcj(district.lng, district.lat) || {gcj_Lng: 0, gcj_Lat: 0};
    const marker =  new AMap.Marker({
      position: [GCJ.gcj_Lng, GCJ.gcj_Lat],
      icon: require('../../utils/img/' + icon)
    });
    marker.content = `<div class="markerInfo">
      <div class="title">VIN：${district.vin}<a class="close">X</a></div>
        <ul>
        <li><label>车牌号：</label>${district.car_plate}</li>
        <li><label>总里程：</label>${district.miles}km</li>
        <li><label>上报时间：</label>${district.time}</li>
        </ul>
        <button type="button" class="ant-btn ant-btn-primary ant-btn-sm ant-btn-background-ghost" data-vin="${district.vin}">实时定位</button>
      <div>`;
    //<button type="button" class="ant-btn ant-btn-primary ant-btn-sm ant-btn-background-ghost"><span>历史数据</span></button>
    marker.on('click', (e) => {
      this.data.infoWindow.setContent(marker.content);
      this.data.infoWindow.open(this.data.GDMap, e.target.getPosition());
    });
    return marker;
  }
  toggleChartShow = () => {
    this.state.chartDisplay === 'none' 
      ? this.setState({chartDisplay: 'block', hideBtnText: '>'}) 
      : this.setState({chartDisplay: 'none', hideBtnText: '<'});
  }
  rowClick = (record, index, event) => {
    let zoom;
    if (record.level == 0) {
      zoom = 4;
    } else if (record.level == 1) {
      zoom = 5;
    } else {
      zoom = 7;
    }
    this.data.GDMap.setZoomAndCenter(zoom, [record.longitude, record.latitude]);
  }
  selCarFacOnChange = e => {
    this.data.carFactory = e;
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
  render() {
    return (
      <div className="overview">
        <Spin spinning={ this.state.loading }>
          <div className="searchForm">
            <Select defaultValue="" style={{ width: 120, marginRight: 10 }} onChange={this.selCarFacOnChange}>
              <Option value="">车厂</Option>
              {this.props.selectOrg.map(v => <Option key={v.id} value={v.id.toString()}>{v.org_name}</Option>)}
            </Select>
            <Select defaultValue="" style={{ width: 120, marginRight: 10 }} onChange={e => this.data.carType = e}>
              <Option value="">车型</Option>
              {this.state.carTypeSelect.map(v => <Option key={v.id} value={v.id.toString()}>{v.type_name}</Option>)}
            </Select>
            <Button type="primary" shape="circle" icon="search" onClick={ this.test } />
          </div>
          <div className="carCalc">
            <table style={{}}>
              <tbody>
                <tr><th colSpan='2'>车辆统计</th></tr>
                <tr ><td><Badge status="processing" text="行驶:" /></td>
                  <td>{ this.state.totalOnDrive }</td></tr>
                <tr><td><Badge status="success" text="在线:" /></td>
                  <td>{ this.state.totalOnLine }</td></tr>
                <tr><td><Badge status="default" text="离线:" /></td>
                  <td>{ this.state.totalNotOnLine }</td></tr>
                <tr><td><Badge status="warning" text="总计:" /></td>
                  <td>{ this.state.totalOnLine + this.state.totalNotOnLine }</td></tr>
              </tbody>
            </table>
          </div>
          <div className="mapDiv" id="AGDMap"></div>
          <div className="cityDiv">
            <div className="hideBtnDiv" onClick={ this.toggleChartShow }>{ this.state.hideBtnText }</div>
            <div className="chartDiv" style={{ display: this.state.chartDisplay }}>
              {/* <Button type="primary" ghost disabled>导出</Button> */}
              <div ref="chart" />
            </div>
            <div className="tableDiv">
              {/* <Input.Search
                placeholder="行政区查询"
                style={{ width: "100%" }}
                onSearch={value => console.log(value)}
                size="large"
              /> */}
              <Table columns={columns} dataSource={this.state.allDatas} size="small" pagination={false} indentSize={0}
                scroll={{ y: 432 }} rowKey="id" defaultExpandedRowKeys={[100000]} onRowClick={ this.rowClick } />
            </div>
          </div>
        </Spin>
        <Modal visible={ this.state.realSiteVisible }
          width="95%"
          footer={null}
          onCancel={() => this.setState({realSiteVisible: false})}
          key={Math.random()}
        ><RealSite vin={ this.state.realSiteVin } /></Modal>
      </div>
    );
  }
}

export default connect((state, p) => {
  return { selectOrg: state.selectOrg };
})(Overview);