const express = require('express');
const qs = require('querystring');
const app = express();
const redis = require('redis');
const http = require('http');
const mongoose = require('mongoose');
const async = require('async');
const dft = require('dateformat');
const tst_model = require('./model/tst');
const fx_model = require('./model/fx');
const conn_mb = mongoose.connect('mongodb://10.47.90.155:27017,10.25.10.136:27017/db_tst');

const tst = new tst_model(conn_mb);
const fx = new fx_model(conn_mb);
const conn = redis.createClient({host:'10.47.90.155'});

conn.on('error',(err)=>{console.log('connection redis error')});

app.get('/ping.sku',(req,res)=>{res.send('OK');});

function check(param,next){
	try{param.code = param.code.toUpperCase().trim();}
	catch(e){param.code='';}
	async.waterfall([
		(cb)=>{
			fx.user.findOne({code:param.code},(err,res)=>{
				if(res == null){
					cb(null,{result:"failed",jsonResponse:encodeURIComponent('抱歉，优惠码错误，请联系客服！')});
				}else{
					cb(null,{result:"success",jsonResponse:{store:{shopname:encodeURIComponent(res.realname),code:res.code}}});
				}	
		}
	],(err,result)=>{next(result);});
}

app.post('/shopinfocode.sku',(req,res)=>{
	req.on('data',(data)=>{
		var param = qs.parse(decodeURIComponent(data));
		check(param,(result)=>{
			res.send(JSON.stringify(result));
		});
	});
});

app.post('/createOrder.sku',(req,res)=>{
	req.on('data',(data)=>{
		try{var param = qs.parse(decodeURIComponent(data));}catch(e){res.send('{"success":false,"code":"03"}');}
		check(param,(result)=>{
		if(result.result=='failed'){res.send('{"success":false,"code":"04"}');return ;}
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
		var seq_date = dft(new Date(),'yyyymmdd');
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
							var orderAmount = Math.round((vp*param.total*0.925).toFixed(2)*100);
							var coll = new tst.order({_id:seq_date+seq_order,openId:param.openId,yswfCode:param.code.toUpperCase().trim(),goodsId:param.goodsId,total:param.total,queue:Math.round(Math.random()*4)+1,amount:orderAmount,original:(vp*param.total).toFixed(2)*100,unitprice:orderAmount});
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
