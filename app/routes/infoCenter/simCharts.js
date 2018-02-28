import React, { Component } from 'react';
import { Card, Col, Row, Form, Select, Input, Button, DatePicker, Spin } from 'antd';
// import echarts from 'echarts';
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/pie';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/legend';

const { Option } = Select;
const { MonthPicker } = DatePicker;
const ColProps = {
  xl: 8,
  lg: 8,
  md: 12,
  sm: 24,
  xs: 24,
};

class simCharts extends Component {
  render() {
    return (
      <div className="simCharts">
        <div className="searchForm"><QueryForm handleSubmit={this.query} /></div>
        <Spin spinning={ this.state.loading }> 
        {/* <Spin spinning={ true }> */}
          <Row gutter={24} className="chartsRow">
            <Col {...ColProps}>
              <Card title="使用流量分布饼图"><div ref="myCharts0" style={{height: "100%", textAlign: "center", lineHeight: 40, color: "rgb(16, 142, 233)"}}>请选择条件并单击查询按钮！</div></Card>
            </Col>
            <Col {...ColProps}>
              <Card title="待激活、已激活、停卡分布饼图" ref="myCharts1"><div ref="myCharts1" style={{height: "100%", textAlign: "center", lineHeight: 40, color: "rgb(16, 142, 233)"}}>请选择条件并单击查询按钮！</div></Card>
            </Col>
            <Col {...ColProps}>
              <Card title="购卡时间分布图" ref="myCharts2"><div ref="myCharts2" style={{height: "100%", textAlign: "center", lineHeight: 40, color: "rgb(16, 142, 233)"}}>请选择条件并单击查询按钮！</div></Card>
            </Col>
            <div ref="hehe"></div>
          </Row> 
        </Spin>
      </div>
    );
  }
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
    };
    this.data = {
      myCharts: ['', '', ''],//三个图标数据
    }
  }
  query = (ele) => {
    //console.log(ele.queryMonth.format('YYYY-MM'));
    console.log(this.refs.hehe);
    console.log(this.refs.myCharts0);
    this.data.myCharts[0] = echarts.init(this.refs.myCharts0); 
    this.data.myCharts[0].setOption({
      title: {
        //text: '某站点用户访问来源',
        //subtext: '纯属虚构',
        x: 'center'
      },
      tooltip: {
        trigger: 'item',
        formatter: "{a} <br/>{b} : {c} ({d}%)"
      },
      legend: {
        orient: 'vertical',
        left: 'left',
        data: ['直接访问', '邮件营销', '联盟广告', '视频广告', '搜索引擎']
      },
      series: [
        {
          name: '访问来源',
          type: 'pie',
          radius: '55%',
          center: ['50%', '60%'],
          data: [
            { value: 335, name: '直接访问' },
            { value: 310, name: '邮件营销' },
            { value: 234, name: '联盟广告' },
            { value: 135, name: '视频广告' },
            { value: 1548, name: '搜索引擎' }
          ],
          itemStyle: {
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    });
    document.body.onresize = () => {this.data.myCharts[0].resize();console.log(1)};
  }
}

class queryForm extends Component {
  render() {
    const { getFieldDecorator, getFieldsValue } = this.props.form;
    return (
      <Form layout="inline">
        <Form.Item>
          {getFieldDecorator('queryCarFac', {
            rules: [
              { required: true, message: '必填项！' },
            ],
          })(
            <Select style={{ width: 200 }} placeholder="车厂" />
          )}  
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('queryMonth', {
            rules: [
              { required: true, message: '必填项！', type: 'object' },
            ],
          })(
            <MonthPicker style={{ width: 200 }} placeholder="月份" />
          )}  
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('querySize', {
            rules: [
              { required: true, message: '必填项！' },
            ],
          })(
            <Select style={{ width: 200 }} placeholder="套餐" />
          )}  
        </Form.Item>
        <Form.Item>
          <Button type="primary" icon="search" disabled={
              /*this.hasErrors(getFieldsError()) 
              || !isFieldTouched('queryVin') 
              || !isFieldTouched('queryRangeTime')*/
              false
            }
            title="查询"
            onClick={this.props.handleSubmit.bind(null, getFieldsValue())}
          />
        </Form.Item>
      </Form>
    );
  }
  constructor(props) {
    super(props);
    
  }
  
}
const QueryForm = Form.create()(queryForm);

export default simCharts;