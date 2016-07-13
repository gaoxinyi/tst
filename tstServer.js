const express = require('express');
const qs = require('querystring');
const app = express();
const redis = require('redis');
const http = require('http');
const mongoose = require('mongoose');
const async = require('async');
const tst_model = require('./model/tst');
const conn_mb = mongoose.connect('mongodb://10.47.90.155:27017,10.25.10.136:27017/db_tst');

const tst = new tst_model(conn_mb);
const conn = redis.createClient({host:'10.47.90.155'});

conn.on('error',(err)=>{console.log('connection redis error')});

app.get('/ping.sku',(req,res)=>{res.send('OK');});

function check(param,next){
	try{param.code = param.code.trim();}
	catch(e){param.code='';}
	async.waterfall([
		(cb)=>{
			conn.get(param.code,(err,reply)=>{
				var re_value = {};
               			try{re_value = JSON.parse(reply);}
                		catch(e){re_value.result="failure";}
                        	cb(null,reply,re_value);
			});
		},
		(reply,re_value,cb)=>{
			if(reply != null && re_value.result == "success"){
				cb(null,reply);
			}else{
                        	var q = qs.stringify({code:param.code});
                        	var tst_req = http.request({host:'wxs.tingmimi.net',port:80,path:'/rest/shopinfocode',method:'POST','headers':{'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8','Content-Length':q.length}},(s_res)=>{
                                	s_res.on('data',(s_data)=>{
                                        	if(s_data.indexOf('success')!=-1){conn.set(param.code,s_data);}
                                        	cb(null,s_data);
                                	});
                        	});
                        	tst_req.write(q);
                        	tst_req.end();
                	}
		}
	],(err,result)=>{next(result);});
}

app.post('/shopinfocode.sku',(req,res)=>{
	req.on('data',(data)=>{
		var param = qs.parse(decodeURIComponent(data));
		check(param,(result)=>{
			res.send(result);
		});
	});
});

app.post('/createOrder.sku',(req,res)=>{
	req.on('data',(data)=>{
		try{var param = qs.parse(decodeURIComponent(data));}catch(e){res.send('{"success":false,"code":"03"}');}
		check(param,(result)=>{
		if(result.indexOf('success')==-1){res.send('{"success":false,"code":"04"}');return ;}
		try{
                        var a = param.openId.split('');
                        var a_num = 0;
			param.timestamp = Number.parseInt(param.timestamp);
                        for(var i=0;i<a.length;i++){a_num += a[i].charCodeAt();}
                        if(param.timestamp+a_num != param.token){
                                res.send('{"success":false,"code":"03"}');
                                return ;
                        }
                }catch(err){res.send('{"success":false,"code":"03"}');return ;}
		var date = new Date().toJSON();
		var seq_date = date.substring(0,4)+date.substring(5,7)+date.substring(8,10);
		conn.hgetall('sale_'+seq_date,(err,value)=>{
                if(err || value == null || value.beginTime > param.timestamp || value.endTime < param.timestamp){res.send('{"success":false,"code":"03"}');return ;}
		conn.get('sku_'+param.goodsId,(err,va)=>{
			if(err || va-param.total < 0){
				res.send('{"success":false,"code":"01"}');
				return ;
			}
			conn.get('SKU_PRICE_'+param.goodsId,(err,vp)=>{
				if(err || vp == null){res.send('{"success":false,"code":"01"}');return ;}
				conn.decrby('sku_'+param.goodsId,param.total,(err,v)=>{
					if(err || v<0){
						conn.incrby('sku_'+param.goodsId,param.total);
						res.send('{"success":false,"code":"01"}');
					}else{
						conn.incrby('seq_order',1,(err,seq_order)=>{
							var coll = new tst.order({_id:seq_date+seq_order,openId:param.openId,yswfCode:param.code,goodsId:param.goodsId,total:param.total,queue:Math.round(Math.random()*4)+1,amount:(vp*param.total*0.925).toFixed(2)*100,original:(vp*param.total).toFixed(2)*100,unitprice:vp*100});
							try{
								coll.save();
                						res.send('{"success":true}');
							}catch(err){
								console.log(err.stack);
								conn.incrby('sku_'+param.goodsId,param.total);
								res.send('{"success":false,"code":"02"}');
							}
						});
					}
				});
			});
		});});});
	});
});

app.post('/searchOrder.sku',(req,res)=>{
	req.on('data',(data)=>{
		var param = qs.parse(decodeURIComponent(data));
		tst.order.find({openId:param.openId},(err,result)=>{
			if(err){res.send('{"success":false,"code":"02"}');return ;}
			conn.hgetall('addr_'+param.openId,(err,value)=>{
				if(err || value == null){res.send('{"success":false,"code":"03"}');return ;}
				res.send(JSON.stringify({success:true,address:JSON.stringify(value),res:result}));
			});
		});
	});
});

app.listen(process.argv[2]);
