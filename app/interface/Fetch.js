

let fetchPost = function(url, data){
  fetch(url, {
    method: 'POST',
    mode: 'same-origin',
    headers: {'Content-Type': 'application/json'},
    // headers:{"Content-Type": "application/x-www-form-urlencoded"}, 
    body: JSON.stringify(data), 
    // body: 'key1=value1&key2=value2',
  }
  ).then(response => response.json())
  .then(data => {
		console.log(data);
	}).catch();
}

// var xmlhttp;
	// if (window.XMLHttpRequest)
	// {
	// 	//  IE7+, Firefox, Chrome, Opera, Safari 浏览器执行代码
	// 	xmlhttp=new XMLHttpRequest();
	// }
	// else
	// {
	// 	// IE6, IE5 浏览器执行代码
	// 	xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
	// }
	// xmlhttp.onreadystatechange=function()
	// {
	// 	if (xmlhttp.readyState==4 && xmlhttp.status==200)
	// 	{
	// 		console.log(xmlhttp.responseText);
	// 	}
	// }
	// xmlhttp.open("POST", 'http://localhost:8080/api/login/userLogin', true);
	// xmlhttp.send(JSON.stringify({1: 1}));

	// 	$.ajax({
	// 		url: "/api/login/userLogin",
	// 		data: {
	// 				account: 1,
	// 				pass: 2
	// 		},
	// 		type: "post",
	// 		timeout: 36000,
	// 		dataType: "text",
	// 		success: function (result,status,xhr) {k
	// 				console.log(result);
	// 				// layer.msg("成功", {offset: ["80%"]});
	// 		},
	// 		error: function (xhr,status,error) {
	// 				console.log(error);
	// 		}
	// });