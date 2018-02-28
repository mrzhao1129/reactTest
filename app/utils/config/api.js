// const url = `http://120.76.243.233:8089/Interface/Ivtss.ashx?json=[{module:"car_type",cmd:"sel",data:[{id:"",car_type:"",org_id:"",orderby:"",pageindex:"",pagesize:""}],user_id:"1",code:""}]`;

// export default {
//   queryCarType: url + "";
// }

// const ip = 'http://localhost';
// const port = ':3000';
//http://192.168.3.222:8080/visp
// const ip = 'http://192.168.3.222';
// const port = ':8080';
const ip = '';
const port ='';
const version = 1;
const before = ip + port + '/visp/api/v' + version;

const login = ip + port + '/api/login';

// export const overview = '/overview';
export const userLogin = login + "/userLogin";
//20170821 15:03

export const getPubKeyCode = '12345678910';
export const url_getPubKey = `${before}/login/getPubKey`;
export const url_login = `${before}/login/login`;
//export const url_loginByPass = `${before}/loginByPass`;
export const url_loginByToken = `${before}/login/loginByToken`;
export const url_upPass = `${before}/user/user/upPass`;//修改密码
//首页模块
//概览
export const url_getCarStateByTol = `${before}/overview/getCarStateByTol`;
export const url_getCarStateByCity = `${before}/overview/getCarStateByCity`;
//
//监控中心
export const url_getHisGps = `${before}/monitor/gps/getHisGps`;//历史轨迹
export const url_getHisGpsToExcel = `${before}/monitor/gps/getHisGpsToExcel`;//历史轨迹d导出
export const url_getHisData = `${before}/monitor/his/getHisData`;//历史数据
export const url_getHisDataToExcel = `${before}/monitor/his/getHisDataToExcel`;//历史数据导出
export const url_getHisAlarm = `${before}/monitor/alarm/getHisAlarm`;//报警管理
//export const url_getAlarmItem = `${before}/monitor/alarm/getAlarmItem`;//报警管理参数
export const url_getHisAlarmToExcel = `${before}/monitor/alarm/getHisAlarmToExcel`;//报警管理导出

export const url_getDirectAlarmParam = `${before}/monitor/param/getDirectAlarmParam`;//直接报警管理查询
export const url_postDirectAlarmParam = `${before}/monitor/param/postDirectAlarmParam`;//直接报警管理新增
export const url_putDirectAlarmParam = `${before}/monitor/param/putDirectAlarmParam`;//直接报警管理修改
export const url_delDirectAlarmParam = `${before}/monitor/param/delDirectAlarmParam`;//直接报警管理删除

export const url_getIndirectAlarmParam = `${before}/monitor/param/getIndirectAlarmParam`;//间接报警管理查询
export const url_postIndirectAlarmParam = `${before}/monitor/param/postIndirectAlarmParam`;//间接报警管理新增
export const url_putIndirectAlarmParam = `${before}/monitor/param/putIndirectAlarmParam`;//间接报警管理修改
export const url_delIndirectAlarmParam = `${before}/monitor/param/delIndirectAlarmParam`;//间接报警管理删除
//信息中心
export const url_getCar = `${before}/info/car/getCar`;//车辆查询
export const url_postCar = `${before}/info/car/postCar`;//车辆添加
export const url_putCar = `${before}/info/car/putCar`;//车辆修改
export const url_delCar = `${before}/info/car/delCar`;//车辆删除
export const url_getCarToExcel = `${before}/info/car/getCarToExcel`;//车辆Excel导出
export const url_postCarByExcel = `${before}/info/car/postCarByExcel`;//车辆Excel导入

export const url_getCarFactory = `${before}/info/carFactory/getCarFactory`;//车厂查询//历史遗留版本
export const url_getCarFactory2 = `${before}/info/factory/getFactory`;//车厂查询
export const url_postCarFactory = `${before}/info/factory/postFactory`;//车厂添加
export const url_putCarFactory = `${before}/info/factory/putFactory`;//车厂修改
export const url_delCarFactory = `${before}/info/factory/delFactory`;//车厂删除

export const url_getType = `${before}/info/carType/getType`;//车型查询
export const url_postCarType = `${before}/info/carType/postCarType`;//车型新增
export const url_putCarType = `${before}/info/carType/putCarType`;//车型修改
export const url_delCarType = `${before}/info/carType/delCarType`;//车型删除
export const url_getMenuType = `${before}/info/carType/getMenuType`;//车型--下拉菜单

export const url_getMenuGroup = `${before}/info/group/getMenuGroup`;//分组--下拉菜单
export const url_getTreeGroup = `${before}/info/group/getTreeGroup`;//分组--获取树形菜单
export const url_getGroup = `${before}/info/group/getGroup`;//分组--查
export const url_postGroup = `${before}/info/group/postGroup`;//分组--增
export const url_putGroup = `${before}/info/group/putGroup`;//分组--改
export const url_delGroup = `${before}/info/group/delGroup`;//分组--删

export const url_getGroupCar = `${before}/info/group/getGroupCar`;//车辆分组管理--查询
export const url_getCarToGroup = `${before}/info/group/getCarToGroup`;//车辆分组管理--待分配分组查询
export const url_postGroupCar = `${before}/info/group/postGroupCar`;//车辆分组管理--新增
export const url_delGroupCar = `${before}/info/group/delGroupCar`;//车辆分组管理--删除
export const url_postGroupCarByExcel = `${before}/info/group/postGroupCarByExcel`;//车辆分组管理--导入

export const url_getTbox = `${before}/info/tbox/getTbox`;///终端管理--信息查询
export const url_getTboxToExcel = `${before}/info/tbox/getTboxToExcel`;///终端管理--信息导出

export const url_getTboxConSendCount = `${before}/info/tbox/getTboxConSendCount`;///终端管理--参数设置--查询  √
export const url_getTboxConSend = `${before}/info/tbox/getTboxConSend`;///终端管理--参数设置--查看进度  × 上一条有数据后进行测试
export const url_putTboxConSendEnd = `${before}/info/tbox/putTboxConSendEnd`;///终端管理--参数设置--取消  × 上一条有数据后进行测试

export const url_postTboxConCarByExcel = `${before}/info/tbox/postTboxConCarByExcel`;///终端管理--参数设置--excel导入  √
export const url_getTboxConCar = `${before}/info/tbox/getTboxConCar`;///终端管理--参数设置--检索接口  √
export const url_postTboxWakeBySms = `${before}/info/tbox/postTboxWakeBySms`;//终端管理--参数设置--短信唤醒  √
export const url_postTboxReset = `${before}/info/tbox/postTboxReset`;//终端管理--参数设置--下发复位  √
export const url_postTboxShutdown = `${before}/info/tbox/postTboxShutdown`;//终端管理--参数设置--关机下发  √
export const url_postTboxConSel = `${before}/info/tbox/postTboxConSel`;//终端管理--参数设置--配置查询  √
export const url_postTboxConSend = `${before}/info/tbox/postTboxConSend`;//终端管理--参数设置--配置下发  √

export const url_getTboxUpSendCount = `${before}/info/tbox/getTboxUpSendCount`;//终端管理--软件升级--查询  √
export const url_getTboxUpSend = `${before}/info/tbox/getTboxUpSend`;//终端管理--软件升级--查看进度  × 接口404
export const url_putTboxUpSendEnd = `${before}/info/tbox/putTboxUpSendEnd`;//终端管理--软件升级--取消  √

export const url_getTboxUpCar = `${before}/info/tbox/getTboxUpCar`;//(*废弃*)终端管理--软件升级--检索接口  √
export const url_postTboxUpCarByExcel = `${before}/info/tbox/postTboxUpCarByExcel`;//终端管理--软件升级--Excel导入  √
export const url_postTboxUpSend = `${before}/info/tbox/postTboxUpSend`;//终端管理--软件升级--下发升级 √
//APP管理http:// 192.168.3.218:8088
export const url_appManage = "/Interface/Ivisp_vpmp.ashx?json=";
//用户管理
export const url_getUser = `${before}/user/user/getUser`;//用户管理-查询
export const url_postUser = `${before}/user/user/postUser`;//用户管理-新增
export const url_putUser = `${before}/user/user/putUser`;//用户管理-修改
export const url_delUser = `${before}/user/user/delUser`;//用户管理-删除

export const url_getRole = `${before}/user/role/getRole`;//角色管理-查询
export const url_postRole = `${before}/user/role/postRole`;//角色管理-添加
export const url_putRole = `${before}/user/role/putRole`;//角色管理-修改
export const url_delRole = `${before}/user/role/delRole`;//角色管理-删除
export const url_getMenuRole = `${before}/user/role/getMenuRole`;//角色管理-下拉菜单
export const url_getRoleRight = `${before}/user/role/getRoleRight`;//角色管理-角色分配菜单及权限查询
export const url_putRoleRight = `${before}/user/role/putRoleRight`;//角色管理-角色分配菜单及权限新增

//系统管理
export const url_getOrg = `${before}/plat/org/getOrg`;//组织机构管理-查询
export const url_postOrg = `${before}/plat/org/postOrg`;//组织机构管理-新增
export const url_putOrg = `${before}/plat/org/putOrg`;//组织机构管理-修改
export const url_delOrg = `${before}/plat/org/delOrg`;//组织机构管理-删除
export const url_getMenuOrg = `${before}/plat/org/getMenuOrg`;//组织机构管理-下拉菜单

export const url_getSys = `${before}/plat/sys/getSys`;//系统管理-查询
export const url_postSys = `${before}/plat/sys/postSys`;//系统管理-新增
export const url_putSys = `${before}/plat/sys/putSys`;//系统管理-修改
export const url_delSys = `${before}/plat/sys/delSys`;//系统管理-删除

export const url_getMenu = `${before}/plat/menu/getMenu`;//菜单管理-查询
export const url_getTreeMenu = `${before}/plat/menu/getTreeMenu`;//菜单管理-查询树型菜单
export const url_postMenu = `${before}/plat/menu/postMenu`;//菜单管理-新增
export const url_putMenu = `${before}/plat/menu/putMenu`;//菜单管理-修改
export const url_delMenu = `${before}/plat/menu/delMenu`;//菜单管理-删除

// export const url_getRight = `${before}/plat/right/getRight`;//权限管理-查询
// export const url_postRight = `${before}/plat/right/postRight`;//权限管理-添加
// export const url_putRight = `${before}/plat/right/putRight`;//权限管理-修改
// export const url_delRight = `${before}/plat/right/delRight`;//权限管理-删除

export const url_getDic = `${before}/plat/dictionary/getDic`;//字典管理-查询
export const url_getMenuDic = `${before}/plat/dictionary/getMenuDic`;//字典管理-查询下拉框
export const url_postDic = `${before}/plat/dictionary/postDic`;//字典管理-添加
export const url_putDic = `${before}/plat/dictionary/putDic`;//字典管理-修改
export const url_delDic = `${before}/plat/dictionary/delDic`;//字典管理-删除

export const url_getLog = `${before}/plat/log/getLog`;//日志管理-查询
export const url_getLogDetail = `${before}/plat/log/getLogDetail`;//日志管理-查询详情
export const url_postLog = `${before}/plat/log/postLog`;//日志管理-添加

export const url_getParam = `${before}/plat/param/getParam`;//参数管理-查询
export const url_getMenuParam = `${before}/plat/param/getMenuParam`;//参数管理-查询下拉框
export const url_postParam = `${before}/plat/param/postParam`;//参数管理-添加
export const url_putParam = `${before}/plat/param/putParam`;//参数管理-修改
export const url_delParam = `${before}/plat/param/delParam`;//参数管理-删除

export const url_getArea = `${before}/plat/area/getArea`;//区域划分管理-查询
export const url_postArea = `${before}/plat/area/postArea`;//区域划分管理-添加
export const url_putArea = `${before}/plat/area/putArea`;//区域划分管理-修改
export const url_delArea = `${before}/plat/area/delArea`;//区域划分管理-删除
//ota设备管理
export const url_ota2FindHard = '/Ota2/findHard.do';//硬件版本查询（下拉）
export const url_ota2FindSoft = '/Ota2/findSoft.do';//软件版本查询（下拉）
export const url_ota2FindBatch = '/Ota2/findBatch.do';//批次查询（下拉）发货批次

// export const url_otaDevinfoGetDev = '/Ota2/api/v1/devinfo/getDev';//首页查询
export const url_otaDevinfoGetDev = '/Ota2/api/v2/devinfo/getDev';//首页查询
export const url_otaDevinfoProDev = '/Ota2/api/v2/devinfo/postProDev';//生产
export const url_otaDevinfoPutSendDev = '/Ota2/api/v2/devinfo/putSendDev';//发货
export const url_otaDevinfoPutRetDev = '/Ota2/api/v2/devinfo/putRetDev';//退货
export const url_otaDevinfoPutRelRetExchDev = '/Ota2/api/v2/devinfo/putRelRetExchDev';//退换货关系
export const url_otaDevinfoPostfile = '/Ota2/api/v1/devinfo/postfile';//退换货关系（所有文件上传）
export const url_otaDevinfoDelete = '/Ota2/api/v2/devinfo/delete';//删除
//v2用node开发
export const url_otaDevinfoProduceGet = '/Ota2/api/v2/devinfo/produce/get';// 生产批次维护查询
export const url_otaDevinfoProduceSet = '/Ota2/api/v2/devinfo/produce/set';// 生产批次维护添加
export const url_otaDevinfoProduceEdit = '/Ota2/api/v2/devinfo/produce/edit';// 生产批次维护修改

export const url_otaDevinfoSendGet = '/Ota2/api/v2/devinfo/send/get';// 发货批次维护查询
export const url_otaDevinfoSendSet = '/Ota2/api/v2/devinfo/send/set';// 发货批次维护添加
export const url_otaDevinfoSendEdit = '/Ota2/api/v2/devinfo/send/edit';// 发货批次维护修改