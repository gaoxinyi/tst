const express = require('express');
const qs = require('querystring');
const app = express();
const https = require('https');
const redis = require('redis');
const dft = require('dateformat');

const conn = redis.createClient({host:'10.47.90.155'});

app.get('/login.app',(req,res)=>{
	var param = req.query;
	try{
		var now = new Date();
		var timer = now.getTime();
		var dft_now = dft(now,'yyyymmdd');
		var qs_param = {openid:param.uid,timestamp:timer};
		if(param.state == 'shopping'){
			conn.hgetall('sale_'+dft_now,(err,value)=>{
				if(value == null){res.send('<h1>活动未开始</h1>');}
				else{
	            	qs_param.goodsId = value.sku;
					qs_param.beginTime = value.beginTime;
					qs_param.endTime = value.endTime;
					var a = param.uid.split('');
                    var a_num = 0;
                    for(var i=0;i<a.length;i++){a_num += a[i].charCodeAt();}
                    qs_param.token = timer+a_num;
	             	geter = qs.stringify(qs_param);
	            	res.redirect(301,"http://tstapi.sku360.com.cn/shopping.html?"+geter);
	            }
			});
		}else{
			res.end();
		}
	}catch(err){
		console.log(e);res.end();
	}
});

app.listen(process.argv[2]);