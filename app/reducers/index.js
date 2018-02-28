import { combineReducers } from 'redux';
// import items from './items';
// import editor from './editor';
import exp from './exp';
import userInfo from './userInfo';
import selectFactory from './selectDatas';//selectFac
import selectOrg from './selectOrg';//selectFac
import selectObj from './selectObj';

const rootReducer = combineReducers({
  // items,
  // editor,
  // exp,
  userInfo,
  selectFactory,
  selectOrg,
  selectObj,
});

export default rootReducer;