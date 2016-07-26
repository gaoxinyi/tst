const fs = require('fs');
const crypto = require('crypto');
const qs = require('querystring');
const express = require('express');
const dft = require('dateformat');
const mongoose = require('mongoose');
const tst_model = require('./model/tst');
const redis = require('redis');

const key = fs.readFileSync('/share/key/99bill-rsa.pem');
const key2 = fs.readFileSync('/share/key/99bill.cert.rsa.20340630.cer');
const key3 = fs.readFileSync('/share/key/rsa_public_key.pem');
const key_sort = ['merchantAcctId','version','language','signType','payType','bankId','orderId','orderTime','orderAmount','bindCard','bindMobile','dealId','bankDealId','dealTime','payAmount','payResult','errCode'];
const app = express();
const conn_mb = mongoose.connect('mongodb://10.47.90.155:27017,10.25.10.136:27017/db_tst');
const tst = new tst_model(conn_mb);
const conn = redis.createClient({host:'10.47.90.155'});
conn.on('error',(err)=>{console.log('connection redis error')});

function kqPay(order,res){
	var now = dft(new Date(),'yyyymmddHHMMss');
	var sign = crypto.createSign('RSA-SHA1');
	var pay_param = {inputCharset:1,bgUrl:'http://tst.sku360.com.cn/notice.pay',version:'mobile1.0',language:1,signType:4,merchantAcctId:'1002746126801',payerIdType:3,payerId:order.openId,orderId:order._id,orderAmount:order.amount,orderTime:now,productName:'TST庭秘密',payType:'00',redoFlag:1};
	var qs_get = [];
	for(k in pay_param){
		qs_get.push([k,'=',pay_param[k]].join(''));
	}
	sign.update(qs_get.join('&'),'utf8');
	pay_param.signMsg = sign.sign(key,'base64');
	res.send(JSON.stringify({success:true,msg:qs.stringify(pay_param)}));
}

function aliPay(order,res){
	res.send(JSON.stringify({success:true,orderCode:order._id,amount:order.amount}));
}

app.post('/pay.ali',(req,res)=>{
	req.on('data',(data)=>{
		try{
			var param = qs.parse(decodeURIComponent(data));
			tst.order.update({_id:param.orderCode},{addressCode:param.addressCode},(err,result)=>{
		    	if(err){console.log(err.stack);res.send(JSON.stringify({success:false,msg:'系统异常'}));}
				tst.order.findById(param.orderCode,(err,order)=>{
				if(err || order==null || order.isPay != '0'){res.send(JSON.stringify({success:false,msg:'订单不存在或已关闭'}));return ;}
					conn.get('sku_store_'+order.goodsId,(err,va)=>{
						if(err || va-order.total < 0){res.send(JSON.stringify({success:false,msg:'库存不足'}));}
						else{
							if(param.payType == 'aliPay'){aliPay(order,res);}
							else{kqPay(res);}
						}
					});
				});
			});
		}catch(e){
			console.log(e.stack);
			res.send(JSON.stringify({success:false,msg:'系统异常'}));
		}
	});
});

app.get('/notice.pay',(req,res)=>{
	try{
		var param = req.query;
		console.log(param);
		var res_sign = param.signMsg;
		delete param.signMsg;
		var verify = crypto.createVerify('RSA-SHA1');
		var qs_get = [];
        for(i in key_sort){
			var k = key_sort[i];
			if(param[k] != ''){qs_get.push([k,'=',param[k]].join(''));}
        }
		verify.update(qs_get.join('&'),'utf8');
		var result = verify.verify(key2, res_sign, 'base64');
		if(result){
			if(param.payResult == '10'){param.payResult = true;isPay = '1';}else{param.payResult = false;isPay = '2';}
			var payLog = new tst.payLog({wxPayCode:param.dealId,totalFee:param.payAmount,orderCode:param.orderId,payTime:param.dealTime,payResult:param.payResult});
			try{
				payLog.save();
				tst.order.findById(param.orderId,(err,order)=>{
					if(err || order == null){console.log(err.stack);res.send('<result>0</result><redirecturl>http://tstapi.sku360.com.cn/pay/result.html</redirecturl>');}
					else if(order.isPay == '1' || isPay == '2'){res.send('<result>1</result><redirecturl>http://tstapi.sku360.com.cn/pay/result.html</redirecturl>');}
					else{
						tst.order.update({_id:param.orderId},{isPay:isPay,wxPayCode:param.dealId,payTime:param.dealTime},(err,result)=>{
				            if(err){console.log(err.stack);res.send('<result>0</result><redirecturl>http://tstapi.sku360.com.cn/pay/result.html</redirecturl>');return ;}
							conn.decrby('sku_store_'+order.goodsId,order.total,(err,v)=>{
						    	if(err){console.log(err.stack);}
						    	res.send('<result>1</result><redirecturl>http://tstapi.sku360.com.cn/pay/result.html</redirecturl>');
					        });
				        });
					}
				});
			}catch(err){console.log(err.stack);res.send('<result>0</result><redirecturl>http://tstapi.sku360.com.cn/pay/result.html</redirecturl>');}
		}else{
			res.send('<result>0</result><redirecturl>http://tstapi.sku360.com.cn/pay/result.html</redirecturl>');
		}
	}catch(e){
		console.log(e.stack);
		res.send('<result>0</result><redirecturl>http://tstapi.sku360.com.cn/pay/result.html</redirecturl>');
	}
});

app.post('/aliNotice.ali',(res,req)=>{
	try{
		res.on('data',(data)=>{
			var param = qs.parse(decodeURIComponent(data));
			console.log(param);
			var res_sign = param.sign;
			delete param.sign;
			delete param.sing_type;
			var verify = crypto.createVerify('RSA-SHA1');
			var qs_get = [];
			var ali_key_sort = Object.keys(param);
	        for(i in ali_key_sort){
				var k = ali_key_sort[i];
				qs_get.push([k,'=',param[k]].join(''));
	        }
			verify.update(qs_get.join('&'),'utf8');
			var result = verify.verify(key3, res_sign, 'base64');
			if(result){
				if(param.trade_status == 'TRADE_FINISHED'){param.payResult = true;isPay = '1';}else{param.payResult = false;isPay = '2';}
				param.gmt_payment = dft(new Date(param.gmt_payment),'yyyymmddHHMMss');
				var payLog = new tst.payLog({wxPayCode:param.trade_no,totalFee:param.total_fee*100,orderCode:param.out_trade_no,payTime:param.gmt_payment,payResult:param.payResult,payType:'alipay'});
				try{
					payLog.save();
					tst.order.findById(param.out_trade_no,(err,order)=>{
						if(err || order == null){console.log(err.stack);res.send('failure');}
						else if(order.isPay == '1' || isPay == '2'){res.send('success');}
						else{
							tst.order.update({_id:param.out_trade_no},{isPay:isPay,wxPayCode:param.trade_no,payTime:param.gmt_payment,payType:'alipay'},(err,result)=>{
					            if(err){console.log(err.stack);res.send('failure');return ;}
								conn.decrby('sku_store_'+order.goodsId,order.total,(err,v)=>{
							    	if(err){console.log(err.stack);}
							    	res.send('success');
						        });
					        });
						}
					});
				}catch(err){console.log(err.stack);res.send('failure');}
			}else{
				res.send('failure');
			}
		});
	}catch(e){
		console.log(e.stack);
		res.end();
	}
});

app.listen(process.argv[2]);