import * as storage from '../utils/storage';
import { Axios } from '../interface';
import { url_getCarFactory, url_getMenuOrg, url_getMenuRole, url_getMenuGroup,
  url_getMenuType, url_getDic, url_getParam } from '../utils/config/api';

export const INIT_USERINFO = 'INIT_USER_INFO';
export function initUserInfo(info){
  return {
    type: INIT_USERINFO,
    info
  }
}

export const Init_SelectFac = 'InitSelectFac';
export const Init_SelectOrg = 'InitSelectOrg';
export const Init_SelectRole = 'InitSelectRole';
export const Init_SelectGroup = 'InitSelectGroup';
export const Init_SelectType = 'InitSelectType';
export const Init_ButtonRules = 'InitButtonRules';
export const Init_SelectDic = 'InitSelectDic';
export const Init_SelectParam = 'InitSelectParam';

/**
 * 设置车厂下拉框数据
 * @param {object} info 状态
 * @returns 
 */
function initSelectFac(info) {
  return {
    type: Init_SelectFac,
    info,
  }
}
function InitButtonRules(info) {
  return {
    type: Init_ButtonRules,
    info,
  }
}
export const getSelectFac = () => (dispatch, getState) => {
  console.warn('getSelectFactory.length===0:', getState().selectFactory.length === 0);
  getState().selectFactory.length === 0 ? Axios({
      url: url_getCarFactory,
      data: { id: '', factory: '',}
    }).then(res => {
      dispatch(initSelectFac(res.data));
    }) : "";
};
export const getSelectOrg = () => (dispatch, getState) => {
  console.warn('getSelectOrg.length===0:', getState().selectOrg.length === 0);
  getState().selectOrg.length === 0 ? Axios({
      url: url_getMenuOrg,
    }).then(res => {
      res ? dispatch({type: Init_SelectOrg, info: res.data,}) : '';
    }) : "";
};
export const getSelectRole = () => (dispatch, getState) => {
  console.warn('selectObj.selectRole.length===0:', getState().selectObj.selectRole.length === 0);
  getState().selectObj.selectRole.length === 0 ? Axios({
      url: url_getMenuRole,
    }).then(res => {
      res ? dispatch({type: Init_SelectRole, info: res.data,}) : '';
    }) : "";
};
export const getSelectGroup = () => (dispatch, getState) => {
  console.warn('selectObj.selectGroup.length===0:', getState().selectObj.selectGroup.length === 0);
  getState().selectObj.selectGroup.length === 0 ? Axios({
      url: url_getMenuGroup,
    }).then(res => {
      let infos = [];
      if(res) {
        const getGroup = (children) => {
          for(let i = 0; i < children.length; i++) {
            infos.push({id: children[i].id, text: children[i].text});
            children[i].children && children[i].children.length > 0 ? getGroup(children[i].children) : ''; 
          }
        };
        getGroup(res.data);
        dispatch({type: Init_SelectGroup, info: infos,})
      }
      // res ? dispatch({type: Init_SelectGroup, info: res.data,}) : '';
    }) : "";
};
export const getSelectType = () => (dispatch, getState) => {
  console.warn('selectObj.selectType.length===0:', getState().selectObj.selectType.length === 0);
  getState().selectObj.selectType.length === 0 ? Axios({
      url: url_getMenuType,
      data: {
        orgId: '',
      }
    }).then(res => {
      res ? dispatch({type: Init_SelectType, info: res.data,}) : '';
    }) : "";
};
export const getSelectDic = () => (dispatch, getState) => {
  console.warn('selectObj.selectDic.length===0:', getState().selectObj.selectDic.length === 0);
  getState().selectObj.selectDic.length === 0 ? Axios({
      url: url_getDic,
      data: {
        orgId: '',
      }
    }).then(res => {
      res ? dispatch({type: Init_SelectType, info: res.data,}) : '';
    }) : "";
}
export const getSelectParam = () => (dispatch, getState) => {
  console.warn('selectObj.selectParam.length===0:', getState().selectObj.selectParam.length === 0);
  getState().selectObj.selectParam.length === 0 ? Axios({
      url: url_getParam,
      data: {
        orgId: '',
      }
    }).then(res => {
      res ? dispatch({type: Init_SelectType, info: res.data,}) : '';
    }) : "";
}