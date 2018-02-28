/**
 * key: 唯一标示符
 * icon: 图标
 * name: 展示名称
 * link: 路由
 * childs: 子项目
 */
const menuItems = [
  {
    key: '01', icon: 'environment', name: '概览', link: '/overview', 
    component: '',
  },{
    key: '02', icon: 'video-camera', name: '监控中心', childs: [
      { key: '0201', name: '车辆定位', childs: [
        { key: '020101', name: '实时定位', link: '/realSite' },
        { key: '020102', name: '历史轨迹', link: '/hisPath' },
      ]},
      { key: '0202',  name: '实时数据', link: '/realData',},
      { key: '0203', name: '历史数据', link: '/hisData',},
      { key: '0204', name: '报警管理', link: '/alertManage'},
      { key: '0205', name: '报警参数', childs: [
        { key: '020501', name: '直接报警参数', link: '/directSet' },
        { key: '020502', name: '间接报警参数', link: '/indirectSet' },
      ]},
    ]
  },{
    key: '03', icon: 'tool', name: '生产管理',
    childs: [
      { key: '0301', name: 'T-Box生产', link: '/tBoxProd',},
      { key: '0302', name: '车辆生产', link: '/carProd',},
    ]
  },{
    key: '05', icon: 'global', name: '信息中心',
    childs: [
      { key: '0501', name: '车厂管理', link: '/carFacMag',},
      { key: '0502', name: '车型管理', link: '/carTypeMag',},
      { key: '0503', name: '分组管理', link: '/groupMag',},
      { key: '0504', name: '终端管理', childs: [
        { key: '050401', name: '终端信息', link: '/devInfo' },
        { key: '050402', name: '参数设置', link: '/devParam' },
        { key: '050403', name: '软件升级', link: '/devUpdate' },
      ]},
      { key: '0505', name: 'SIM卡管理', childs: [
        { key: '050501', name: '套餐管理', link: '/simMag' },
        { key: '050502', name: '数据统计', link: '/simCharts' },
      ]},
      { key: '0506', name: '车辆管理', link: '/carMag',},
    ]
  },{
    key: '06', icon: 'appstore-o', name: 'APP管理',
    childs: [
      { key: '0601', name: '用户管理', link: '/userMag',},
      { key: '0602', name: '操作日志', link: '/controlMag',},
      { key: '0603', name: '设置管理', link: '/setMag',},
      { key: '0604', name: 'APP升级', link: '/appUpdate',},
    ]
  },{
    key: '07', icon: 'line-chart', name: '统计分析',
    childs: [
      { key: '0601', name: '单车统计', link: '/test2',},
      { key: '0602', name: '总体统计', link: '/test2',},
    ]
  },{
    key: '08', icon: 'user', name: '用户管理',
    childs: [
      { key: '0801', name: '账户管理', link: '/accountMag',},
      { key: '0802', name: '角色管理', link: '/partMag',},
    ]
  },{
    key: '04', icon: 'setting', name: '系统管理',
    childs: [
      { key: '0401', name: '组织机构管理', link: '/orgMag',},
      { key: '0402', name: '系统管理', link: '/sysMag',},
      { key: '0403', name: '菜单管理', link: '/menuMag',},
      // { key: '0404', name: '权限管理', link: '/ruleMag',},
      { key: '0405', name: '字典管理', link: '/dicMag',},
      { key: '0406', name: '日志管理', link: '/sysLog',},
      { key: '0407', name: '参数管理', link: '/paramMag',},
      { key: '0408', name: '区域划分管理', link: '/disDevideMag',},
    ]
  },
]

export default menuItems;