import {message} from 'antd';

import {userLogin} from '../utils/config/api';
import {insertEntry, getAll} from '../utils/storage.js';

let doLogin = function(formData) {
  // fetch('http://localhost:8080/api/login/userLogin', {
  fetch(userLogin, {
		method: 'POST',
    mode: 'same-origin',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(formData), 
		credentials: 'include',
  })
	.then(response => response.json())
  .then(data => {
		if(data.code === 200){
			message.success(data.msg);
			insertEntry('account', formData.username);
		}else{
			message.error(data.msg);
		}
	}).catch();

  
}

export {doLogin};