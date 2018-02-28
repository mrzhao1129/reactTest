import { INIT_USERINFO } from '../actions'

export default function userInfo(state = {}, action){
  switch(action.type) {
    case INIT_USERINFO:
      return action.info
      break;
    default: 
      return state;
      break;
  }
}