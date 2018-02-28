import Mock from 'mockjs';

Mock.setup({
  timeout: '200-500'
})

Mock.mock('/api/overview', {
  state: 200,
  msg: '获取数据成功！',
  data: [{
    code: '100000',
    'count|10000-50000': 100
  }]
});

Mock.mock('/api/overview2', {
  'state': 200,
  'msg': '获取数据成功！',
  'data': [{
    'key': '0',
    'district': '中国',
    'level': 0,
    'driving|1000-5000': 1,
    'online|1000-5000': 1,
    'offline|1000-5000': 1,
    'lat': 116.403793,
    'long': 39.883255,
    'children|30': [{
      'key|+1': 1,
      'district': '@province',
      'level': 1,
      'driving|100-500': 1,
      'online|100-500': 1,
      'offline|100-500': 1,
      'lat|75-128.6': 1,
      'long|25-41.6': 1,
      'children|5-8': [{
        'key|+1': 31,
        'district': '@city',
        'level': 2,
        'driving|10-50': 1,
        'online|10-50': 1,
        'offline|10-50': 1,
        'lat|75-128.6': 1,
        'long|25-41.6': 1,
      }]
    }]
  }]
});

Mock.mock('/api/overviewCar?city=datong', {
  'state': 200,
  'msg': '获取数据成功！',
  'data|30': [{
    'key|+1': 0,
    'level': 3,
    'state|1': ['on', 'off'],
    'lat|120-120.6': 1,
    'long|30-30.6': 1,
    'carNumber': '晋B',
    'mileage|3000-20000.3': 1, 
    'dataTime': '@datetime',
  }]
});
Mock.mock('/api/hisPath', {
  'state': 200,
  'msg': '获取数据成功！',
  'data|5': [{
    'key|+1': 10000,
    'gprs|+1': 20000,
    'lat|120-120.6': 1.1,
    'long|30-30.6': 1.1,
    'carNumber': '晋B',
    'dataTime': '@datetime',
    'mileage|3000-20000.3': 1, 
    'SOC|+1': 1,
    'totalV|100-200': 1, 
    'totalI|100-200': 1,
  }]
});
Mock.mock('/api/deviceMag', {
  'state': 200,
  'msg': '获取数据成功！',
  'data|10': [{
    'key|+1': 10000,
    'gprs|+1': 20000,
    'lat|120-120.6': 1.1,
    'long|30-30.6': 1.1,
    'carNumber': '晋B',
    'dataTime': '@datetime',
    'mileage|3000-20000.3': 1, 
    'SOC|+1': 1,
    'totalV|100-200': 1, 
    'totalI|100-200': 1,
  }]
});
export default Mock;