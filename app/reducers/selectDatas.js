import { Init_SelectFac } from '../actions'

/**
 * 车厂下拉数据数组
 * @export
 * @param {Arr} [state=[{MECHAN_NAME: "", MECHAN_CODE: "", ID: }]] 
 * @param {Obj} action 
 * @returns 
 */
export default function userInfo(state = [], action){
  switch(action.type) {
    case Init_SelectFac:
      return action.info;
      break;
    default: 
      return state;
      break;
  }
}