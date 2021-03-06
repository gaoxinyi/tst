const express = require('express');
const qs = require('querystring');
const app = express();
const https = require('https');
const redis = require('redis');
const sha1 = require('sha1');
const mongoose = require('mongoose');
const fx_model = require('./model/fx');
const uuid = require('uuid');

const conn_mb = mongoose.connect('mongodb://10.47.90.155:27017,10.25.10.136:27017/db_tst');
const conn = redis.createClient({host:'10.47.90.155'});

const fx = new fx_model(conn_mb);

app.get('/login.wx',(req,res)=>{
        var param = req.query;
        https.get('https://api.weixin.qq.com/sns/oauth2/access_token?appid=wx8bdfe8572057edfe&secret=a65337b4986dc1672e70b2ef0cc712c5&code='+param.code+'&grant_type=authorization_code',(hs_res)=>{
                hs_res.on('data',(hs_data)=>{
                        try{
                        hs_data = JSON.parse(hs_data);
                        var now = new Date();
                        var timer = now.getTime();
                        var openId = hs_data.openid;
                        var geter = '';
                        var qs_param = {html:param.state,openid:openId,timestamp:timer};
                        if(param.state == 'shopping'){
                                var a = openId.split('');
                                var a_num = 0;
                                for(var i=0;i<a.length;i++){a_num += a[i].charCodeAt();}
                                qs_param.token = timer+a_num;
                                qs_param.params = 'openid,timestamp,goodsId,token,beginTime,endTime';
                                var str_now = now.toJSON();
                                conn.hgetall(['sale_',str_now.substring(0,4),str_now.substring(5,7),str_now.substring(8,10)].join(''),(err,value)=>{
                                        if(value == null){res.send('<h1>活动未开始</h1>');}
                                        else{
                                                qs_param.goodsId = value.sku;
						qs_param.beginTime = value.beginTime;
						qs_param.endTime = value.endTime;
                                                geter = qs.stringify(qs_param);
                                                res.redirect(301,"http://wpt.tingmimi.net/source/modules/yswftstshopping/trans.html?"+geter);
                                        }
                                        return ;
                                });
                        }else if(param.state == 'searchOrder'){
                                qs_param.params = 'openid,timestamp';
                                geter = qs.stringify(qs_param);
                                res.redirect(301,"http://wpt.tingmimi.net/source/modules/yswftstshopping/trans.html?"+geter);
			}else if(param.state == 'openCard'){
				qs_param.params = 'openid,timestamp,nonceStr';
				qs_param.timestamp = Math.round(timer/1000);
				qs_param.nonceStr = sha1(qs_param.timestamp);
				conn.hgetall('wx_conf',(err,value)=>{
					if(err || value == null){res.end('error');console.log('redis error');return;}
					geter = qs.stringify(qs_param);
					var p_geter = qs_param;
					delete(p_geter.html);
					delete(p_geter.params);
					var signature = sha1(qs.stringify({'jsapi_ticket':value.ticket,'noncestr':qs_param.nonceStr,'timestamp':qs_param.timestamp})+'&url='+'http://tst.sku360.com.cn/openCard.html?com=sku&'+qs.stringify(p_geter));
                                	res.redirect(301,"http://wpt.tingmimi.net/source/modules/yswftstshopping/trans.html?"+geter+'#'+signature);
				});
                        }else{
				console.log(param.state);
                                res.end();
				return ;
                        }
                        }catch(e){console.log(e);res.end();}
                });
        });
});

app.post('/openCard.wx',(req,res)=>{
        req.on('data',(data)=>{
                var param = qs.parse(decodeURIComponent(data));
                // fx.user.findOne({})
                param._id = uuid.v1();
                var card = new fx.card(param);
                card.save();
                res.send(JSON.stringify({success:true}));
        });
});

app.post('/verifyCard.wx',(req,res)=>{
        req.on('data',(data)=>{
                var param = qs.parse(decodeURIComponent(data));
                var user = {code:param.code,realname:param.name};
                if(param.card_type == '1'){user.idcard = param.card_no;}
                fx.user.findOne(user,(err,row)=>{
                        if(row != null){
                                fx.card.findOne({code:param.code},(err,row)=>{
                                        if(row == null){res.send(JSON.stringify({success:true}));}
                                        else{res.send(JSON.stringify({success:false}));}
                                });
                        }
                        else{res.send(JSON.stringify({success:false}));}
                });
        });
});

app.listen(process.argv[2]);

