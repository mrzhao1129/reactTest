import Overview from './overview';
import { HisPath, RealSite } from './carLocation';
import { RealData, HisData, AlertManage, HisDataDirectSet, HisDataInDirectSet } from './controlCenter';
import { DicMag, MenuMag, OrgMag, ParamMag, RuleMag, SysLog, SysMag, disDevideMag, } from './systemMag';
import { DeviceInfo, DeviceParam, DeviceUpdate, GroupMag, SimMag, SimCharts, CarMag, CarFacMag, CarTypeMag} from './infoCenter';
import { UserMag, ControlMag, AppUpdate, SetMag, } from './appMag';
import { AccountMag, PartMag, } from './userMag';
import { carProd, tBoxProd } from './productionMag';
import { OtaDev, OtaVerRule, OtaReqLog, OtaEditLog } from './ota';
import { HwVer, SwVer, OTADevInfo } from './devMag';

export {
  Overview,
  HisPath, RealSite,
  RealData, HisData, AlertManage, HisDataDirectSet, HisDataInDirectSet,
  //生产管理
  carProd, tBoxProd, 
  //信息中心
  DeviceInfo, DeviceParam, DeviceUpdate, GroupMag, SimMag, SimCharts, CarMag, CarFacMag, CarTypeMag,
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
}