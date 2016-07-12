const fs = require('fs');
const crypto = require('crypto');
const https = require('https');
const qs = require('querystring');
// const express = require('express');
const dft = require('dateformat');

const key = fs.readFileSync('/Users/magic/Downloads/99bill-rsa.pem');
const key2 = fs.readFileSync('/Users/magic/Downloads/99bill.cert.rsa.20340630.cer');
// console.log(key.toString());
// console.log(key2.toString());
var sign = crypto.createSign('RSA-SHA1');
// const app = express();
var verify = crypto.createVerify('RSA-SHA1');
// // console.log(sign);
var sig = 'igPsxsIqfnfkQ5XA7zn+9agpqAQAcVzPie6SnDb1x2yxywGuw7cvtif1Er6+UtbWD3ld5650XZ7yBQg3Qfqa1dymG8LWHWVHmkf+/aNQS1Smp7yBBGtXSdPPT4eoXHB4JQHTrXITYYedl8jtLG10ZlR9FMkziGCtchW3Xu1fQAPOCKQHu8zgM9fVJN5X9fCqmvFRv5PuwZi3JiBoi3BSWEy4UIs8Y9hjeNGCUWfd4pNkMhzfYCrikH5asjjGajDdDc2OO6XRyqeCFR1K0fUzWz8SxzZoy/RTj61uLapVzgFDJbRLpFeqPhclDnCFcMRYWfhd+sZmH6lnOK666krhEw==';
var str = 'merchantAcctId=1002746126801&version=mobile1.0&language=1&signType=4&payType=21-2&bankId=CMB&orderId=201606141024972&orderTime=20160707151527&orderAmount=100&bindCard=3568896470&bindMobile=1801946&dealId=2258284170&bankDealId=160707881293&dealTime=20160707151630&payAmount=100&payResult=10';
verify.update(str,'utf8');
sign.update(str,'utf8');
// sig = sign.sign(key,'base64');
var result = verify.verify(key2, sig, 'base64');
console.log('\n');
console.log(sig);
console.log(result);
// console.log(result);
// qs_get.push('signMsg='+sig);
// var encrypted = key2.encrypt(str, 'base64');
// console.log(encrypted);
// app.post('/pay.pay',(req,res)=>{
// 	req.on('data',(data)=>{
// 		try{
// 			var param = qs.parse(decodeURIComponent(data));
// 			var now = dft(new Date(),'yyyymmddHHMMss');
// 			var pay_param = {inputCharset:1,bgUrl:'http://tst.sku360.com.cn/notice.pay',version:'mobile1.0',language:1,signType:4,merchantAcctId:'1002746126801',orderId:param.orderCode,orderAmount:100,orderTime:now,productName:'TST庭秘密',payType:'00',redoFlag:1};
// 			var qs_get = []
// 			for(k in pay_param){
// 				qs_get.push([k,'=',pay_param[k]].join(''));
// 			}
// 			sign.update(qs_get.join('&'),'utf8');
// 			pay_param.signMsg = sign.sign(key,'base64');
// 			https.get('https://www.99bill.com/mobilegateway/recvMerchantBackendPostOrderAction.htm?'+qs.stringify(pay_param),(hs_res)=>{
// 				hs_res.on('data',(hs_data)=>{
// 					res.send(hs_data.toString());
// 				});
// 			});
// 		}catch(e){
// 			console.log(e.stack);
// 			res.send(JSON.stringify({success:false,msg:'系统异常'}));
// 		}
// 	});
// });
// dealTime=20160708150540&payAmount=100&bindMobile=1801946&signType=4&bindCard=3568896470&errCode=&merchantAcctId=1002746126801&orderTime=20160708150451&dealId=2259085567&version=mobile1.0&bankId=CMB&fee=&bankDealId=160708139858&ext1=&payResult=10&ext2=&orderAmount=100&signMsg=Oo84DjkKrbSe%2BfR5gRF36mVjlEfA0RtZRHNYVucnzc3DL%2B83jGf7JXku9TOfrfGFFb64Nu5%2FaeIjOy1dJhne2LkkSq1Nkp9KFzINxIhJ9SRLWbwagycHMA7J0xTzqdPHxc8S9iEyHDKFkzkL1RoMHtSZ7vhC2bzipHLd04Fh%2FGaV1TDQB%2FZMI5%2FlWpZ%2FQz7sSiwwW5BTqacSF9%2FgiOX6QISq2hB4oCBs%2Fk%2F4pfrWKwMCDAOrcgaLh0hd%2BiR0%2BUa%2FvWrrWy36rQOU%2Bzkfiq%2Bgwlx5SIi9bmhQ0s0EO32NSAVZoLOsdlzhSsvWPQmbjsr7wP98qD87uiZbgJ7LYJx3Rw%3D%3D&payType=21-2&language=1&orderId=201607081000826

// app.listen(process.argv[2]);