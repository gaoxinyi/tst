// var sign = "Z6IobYINXMI716Apj8Z5h4PBpuwqE X7UZR acKhsFZHPSIsog904HtZXPLU6GXip8jm8YSjid2DG7IRi0rcgNO0KxLmvZWOEBYVC6M3mP1y17A4FARRJKGhSINVw07 bIe2I7l/FQxwRnbGrynriZpTkU w0YRWeXYZh6hZPos="

const fs = require('fs');
const crypto = require('crypto');

const key3 = fs.readFileSync('/Users/magic/Downloads/rsa_public_key.pem');

var param = { discount: '0.00',
  payment_type: '1',
  subject: '达尔威',
  trade_no: '2016072621001004570268846591',
  buyer_email: 'gaoxy@me.com',
  gmt_create: '2016-07-26 22:02:17',
  notify_type: 'trade_status_sync',
  quantity: '1',
  out_trade_no: '201607261487103',
  seller_id: '2088221353228224',
  notify_time: '2016-07-26 22:02:17',
  body: 'TST庭秘密APP商城订单',
  trade_status: 'WAIT_BUYER_PAY',
  is_total_fee_adjust: 'Y',
  total_fee: '0.02',
  seller_email: 'tst_app2@sunrise-sh.net',
  price: '0.02',
  buyer_id: '2088902624559572',
  notify_id: 'cd9904c62250954892b79fc817f6689kee',
  use_coupon: 'N',
  sign_type: 'RSA',
  sign: 'Z6IobYINXMI716Apj8Z5h4PBpuwqE X7UZR acKhsFZHPSIsog904HtZXPLU6GXip8jm8YSjid2DG7IRi0rcgNO0KxLmvZWOEBYVC6M3mP1y17A4FARRJKGhSINVw07 bIe2I7l/FQxwRnbGrynriZpTkU w0YRWeXYZh6hZPos=' };
console.log(param);
var res_sign = param.sign;
delete param.sign;
delete param.sign_type;
var verify = crypto.createVerify('RSA-SHA1');
var qs_get = [];
var ali_key_sort = Object.keys(param).sort();
for(i in ali_key_sort){
	var k = ali_key_sort[i];
	qs_get.push([k,'=',param[k]].join(''));
}
console.log(qs_get.join('&'));
verify.update(qs_get.join('&'),'utf8');
var result = verify.verify(key3, res_sign,'base64');
// console.log(key3.toString());
console.log(result);
