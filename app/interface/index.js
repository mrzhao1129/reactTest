import { message, notification } from 'antd';
import axios from 'axios';
import crypto from 'crypto-browserify';
import Cookies from 'js-cookie';
import Qs from 'qs';

import { doLogin } from './login';

// option格式范例
// let optionExp = {
//   method: 'POST',
//   mode: 'same-origin',
//   headers: {'Content-Type': 'application/json'},
//   body: JSON.stringify(formData), 
// }
const CancelToken = axios.CancelToken;
let cancel ='';

const Fetch = (url, option , callback) => {
  option = option ? {
    ...option, 
    headers: {'Content-Type': 'application/json'},
    mode: 'same-origin',
    credentials: 'include',
  } : {
    method: 'GET',
    mode: 'same-origin',
    credentials: 'include',
  }; 

  fetch(url, option).then(response => response.json())
  .then(data => {
		if(data.code === 200){
			message.success(data.msg);
			insertEntry('account', formData.username);
		}else{
			message.error(data.msg);
		}
	}).catch();

  
}
const Fetch2 = async (url, option) => {
  option = option ? {
    ...option, 
    headers: {'Content-Type': 'application/json'},
    mode: 'same-origin',
    credentials: 'include',
  } : {
    method: 'GET',
    // mode: 'same-origin',
    credentials: 'include',
  }; 
  
  fetch(url, option).then(response => response.json())
  .then(data => {
		if(data.code === 200){
			message.success(data.msg);
			return data.data;
		}else{
			message.error(data.msg);
		}
	}).catch();
}

const sortObj = obj => {
  let keys = Object.keys(obj);
  let newObj = {};
  keys.sort();
  for(const v of keys){
    newObj[v] = obj[v];
  }
  return newObj;
}

const Axios = ({method='post', url, data={}, code=Cookies.get('Token'), files, ...others}) => {
  !code ? window.location.href = '/login' : '';
  //warn////////////////////////////////////
  console.warn("排序data：", JSON.stringify(sortObj(data)));
  let outerData = [{code, data: [data], sign: crypto.createHash('sha256').update(JSON.stringify([sortObj(data)])).digest('hex')}];
  // data = [{code: '', data: [data], sign: ''}];
  if(files) {
    //warn////////////////////////////////////
    console.warn('FileList:', files);
    let formData = new FormData();
    for(let i = 0; i < files.length; i++) {
      i > 0 ? formData.append('file' + i, files[0].originFileObj)
        : formData.append('file', files[0].originFileObj);
    }
    formData.append('json', JSON.stringify(outerData));
    outerData = formData;
  }
  //warn////////////////////////////////////
  console.warn('Axios:', url, JSON.stringify(outerData), outerData);
  return axios({method, url, data: outerData, cancelToken: new CancelToken(function executor(c){
    cancel = c;
  }), ...others,})
    .then(function (response) {
      //warn////////////////////////////////////
      console.warn('Axios-res:', response);
      try{
        let  dfj
        //---用来适配柴工、李工、node不同的代码---
        if(toString.call(response.data) === '[object String]') {//李富生适配
          dfj = JSON.parse(response.data)[0];
        } else if(response['headers']['x-powered-by'] === 'Express') {//node适配
          dfj = response.data;
        } else {//柴工JAVA适配
          dfj = response.data[0];
        }
        if(dfj.success === 1){//数据正确性校验
          switch(dfj.state) {
            case 2:
              message.warning(dfj.detail);
              break;
            default:
              notification['warning']({
                message: dfj.detail,
                description: '状态码：' + dfj.state,
                duration: 2,
              });
          }
          return false;
        } else {//数据正确
          //warn////////////////////////////////////
          console.warn(dfj);
          return dfj;
        }
      }catch(error) {
        notification['error']({
          message: '返回数据JSON解析错误！',
          description: error.message,
          duration: 10,
        });
        console.error(error);
        return false;
      }
    }, error => {
      if(error.message=== "中断请求") return false
        notification['error']({
          message: '网络错误！',
          description: error.stack,
          duration: 10,
        });
        console.error(error);
        return false;
    });
}
// Axios.prototype.code = 12345678910;
//WGS转GCJ
const ee = 0.00669342162296594323;
const a = 6378245.0;
const wgsTOgcj = (f_aD8_wgsLon,f_aD8_wgsLat) => {
	if(outofchina(f_aD8_wgsLon,f_aD8_wgsLat)){
		// return {
		// 	gcj_Lng:f_aD8_wgsLon,
		// 	gcj_Lat:f_aD8_wgsLat
    // }
    return false;
	}
	let t_aD8_dLat=transformLat(f_aD8_wgsLon-105.0,f_aD8_wgsLat-35.0);
	let t_aD8_dLon=transformLon(f_aD8_wgsLon-105.0,f_aD8_wgsLat-35.0);
	let t_aD8_radLat=f_aD8_wgsLat/180.0*Math.PI;
	let t_aD8_magic=Math.sin(t_aD8_radLat);
	t_aD8_magic=1-ee*t_aD8_magic*t_aD8_magic;
	let t_aD8_sqrtmagic=Math.sqrt(t_aD8_magic);
	
	t_aD8_dLat=(t_aD8_dLat*180.0)/((a*(1-ee))/(t_aD8_magic*t_aD8_sqrtmagic)*Math.PI);
	t_aD8_dLon=(t_aD8_dLon*180.0)/(a/t_aD8_sqrtmagic*Math.cos(t_aD8_radLat)*Math.PI);
	
	let t_aD8_gcjLat= Number(f_aD8_wgsLat) + Number(t_aD8_dLat);
	let t_aD8_gcjLon= Number(f_aD8_wgsLon)  + Number(t_aD8_dLon) ;
	return{
		gcj_Lng:t_aD8_gcjLon,
		gcj_Lat:t_aD8_gcjLat
	}	
}

const outofchina = (f_aD8_lon, f_aD8_lat) => { 
	if(f_aD8_lon < 72.004 || f_aD8_lon > 137.8347 )
		return true;
	if(f_aD8_lat < 0.8293 || f_aD8_lat > 55.8271)
		return true;
	return false;	
}
const transformLat = (f_aD8_lon, f_aD8_lat) => { 
	var t_aD8_ret = -100.0 + 2.0 * f_aD8_lon + 3.0 * f_aD8_lat + 0.2 * f_aD8_lat * f_aD8_lat + 0.1 * f_aD8_lon * f_aD8_lat + 0.2 * Math.sqrt(Math.abs(f_aD8_lon));
	t_aD8_ret += (20.0 * Math.sin(6.0 * f_aD8_lon * Math.PI) + 20.0 * Math.sin(2.0 * f_aD8_lon * Math.PI)) * 2.0 / 3.0;
	t_aD8_ret += (20.0 * Math.sin(f_aD8_lat * Math.PI) + 40.0 * Math.sin(f_aD8_lat / 3.0 * Math.PI)) * 2.0 / 3.0;
	t_aD8_ret += (160.0 * Math.sin(f_aD8_lat / 12.0 * Math.PI) + 320 * Math.sin(f_aD8_lat * Math.PI / 30.0)) * 2.0 / 3.0;
	return t_aD8_ret;
}

const transformLon = (f_aD8_lon, f_aD8_lat) => { 
	var t_aD8_ret = 300.0 + f_aD8_lon + 2.0 * f_aD8_lat + 0.1 * f_aD8_lon * f_aD8_lon + 0.1 * f_aD8_lon * f_aD8_lat + 0.1 * Math.sqrt(Math.abs(f_aD8_lon));
	t_aD8_ret += (20.0 * Math.sin(6.0 * f_aD8_lon * Math.PI) + 20.0 * Math.sin(2.0 * f_aD8_lon * Math.PI)) * 2.0 / 3.0;
	t_aD8_ret += (20.0 * Math.sin(f_aD8_lon * Math.PI) + 40.0 * Math.sin(f_aD8_lon / 3.0 * Math.PI)) * 2.0 / 3.0;
	t_aD8_ret += (150.0 * Math.sin(f_aD8_lon / 12.0 * Math.PI) + 300.0 * Math.sin(f_aD8_lon / 30.0 * Math.PI)) * 2.0 / 3.0;
	return t_aD8_ret;
}

//////OTA管理用到的接口--by敏杰/////////
const AxiosPost = (url, data = {}) => {
  console.warn('Axios:', url, data);
  return axios.post(url, Qs.stringify(data))
    .then(function (response) {
      // if(response['headers']['x-powered-by'] === 'Express') {//node适配
      //   response = response.data;
      // }
      console.warn('Axios-res:', response)
      try {
        if (response.data.state != 1) {
          notification['warning']({
            message: `返回数据失败`,
            description: response.data.detail,
            duration: 10,
          })
          return false;
        } else { 
          console.warn(response.data);
          return response.data; 
        }
      } catch (err) {
        notification['error']({
          message: 'JSON解析错误！',
          description: error,
          duration: 10,
        });
        console.error(err);
        return false;
      }
    }).catch(function (error) {
      notification['error']({
        message: '网络错误！',
        description: error.stack,
        duration: 10,
      });
      console.error(error);
      return false;
    });
}
//////Node接口适配/////////

export { doLogin, Fetch, Fetch2, Axios, wgsTOgcj ,cancel, AxiosPost};