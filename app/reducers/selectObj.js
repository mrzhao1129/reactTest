import { Init_SelectRole, Init_SelectGroup, Init_SelectType } from '../actions'

/**
 * 车厂下拉数据数组
 * @export
 * @param {Arr} [state=[{MECHAN_NAME: "", MECHAN_CODE: "", ID: }]] 
 * @param {Obj} action 
 * @returns 
 */
export default function selectObj(state = {
  selectRole: [], selectGroup: [], selectType: [], selectDic: [], selectParam: [],
}, action){
  switch(action.type) {
    case Init_SelectRole:
      return {...state, selectRole: action.info};
      break;
    case Init_SelectGroup:
      return {...state, selectGroup: action.info};
      break;
    case Init_SelectType:
      return {...state, selectType: action.info};
      break;
    default: 
      return state;
      break;
  }
}