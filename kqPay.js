const fs = require('fs');
const crypto = require('crypto');
const qs = require('querystring');
const express = require('express');
const dft = require('dateformat');
const mongoose = require('mongoose');
const tst_model = require('./model/tst');
const redis = require('redis');

const key = fs.readFileSync('99bill-rsa.pem');
const key2 = fs.readFileSync('99bill.cert.rsa.20340630.cer');
const key_sort = ['merchantAcctId','version','language','signType','payType','bankId','orderId','orderTime','orderAmount','bindCard','bindMobile','dealId','bankDealId','dealTime','payAmount','payResult','errCode'];
const app = express();
const conn_mb = mongoose.connect('mongodb://10.47.90.155:27017,10.25.10.136:27017/db_tst');
const tst = new tst_model(conn_mb);
const conn = redis.createClient({host:'10.47.90.155'});
conn.on('error',(err)=>{console.log('connection redis error')});

app.post('/pay.pay',(req,res)=>{
	req.on('data',(data)=>{
		try{
			var param = qs.parse(decodeURIComponent(data));
			var sign = crypto.createSign('RSA-SHA1');
			var now = dft(new Date(),'yyyymmddHHMMss');
			tst.order.update({_id:param.orderCode},{addressCode:param.addressCode},(err,result)=>{
		    	if(err){console.log(err.stack);res.send(JSON.stringify({success:false,msg:'系统异常'}));}
				tst.order.findById(param.orderCode,(err,order)=>{
				if(err || order==null){res.send(JSON.stringify({success:false,msg:'订单不存在'}));return ;}
					var pay_param = {inputCharset:1,bgUrl:'http://tst.sku360.com.cn/notice.pay',version:'mobile1.0',language:1,signType:4,merchantAcctId:'1002746126801',orderId:param.orderCode,orderAmount:order.amount,orderTime:now,productName:'TST庭秘密',payType:'00',redoFlag:1};
	                var qs_get = [];
	                for(k in pay_param){
	                	qs_get.push([k,'=',pay_param[k]].join(''));
	                }
	                sign.update(qs_get.join('&'),'utf8');
	                pay_param.signMsg = sign.sign(key,'base64');
	                res.send(JSON.stringify({success:true,msg:qs.stringify(pay_param)}));
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
		if(param.payResult == '10'){
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
					tst.order.update({_id:param.orderId},{isPay:isPay,wxPayCode:param.dealId,payTime:param.dealTime},(err,result)=>{
		            	if(err){console.log(err.stack);}
		                res.send('<result>1</result><redirecturl>http://tstapi.sku360.com.cn/pay/result.html</redirecturl>');
		            });
				}catch(err){console.log(err.stack);res.send('<result>0</result><redirecturl>http://tstapi.sku360.com.cn/pay/result.html</redirecturl>');}
			}else{res.send('<result>0</result><redirecturl>http://tstapi.sku360.com.cn/pay/result.html</redirecturl>');}
		}else{
			res.send('<result>0</result><redirecturl>http://tstapi.sku360.com.cn/pay/result.html</redirecturl>');
		}
	}catch(e){
		console.log(e.stack);
		res.send('<result>0</result><redirecturl>http://tstapi.sku360.com.cn/pay/result.html</redirecturl>');
	}
});

app.listen(process.argv[2]);
