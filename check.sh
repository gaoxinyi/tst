s1=`netstat -nlp | grep 8111 | awk '{print $7}' | awk -F "/" '{print $1}'`
if test -z "$s1"
then
        cd /server/apps/tst
        nohup node tstServer.js 8111 > tstServer.log 2>&1 &
        echo " server1 restart"
else
        :
fi
s2=`netstat -nlp | grep 8112 | awk '{print $7}' | awk -F "/" '{print $1}'`
if test -z "$s2"
then
        cd /server/apps/tst
        nohup node tstServer.js 8112 > tstServer2.log 2>&1 &
        echo " server2 restart"
else
        :
fi
s3=`netstat -nlp | grep 8113 | awk '{print $7}' | awk -F "/" '{print $1}'`
if test -z "$s3"
then
        cd /server/apps/tst
        nohup node tstServer.js 8113 > tstServer3.log 2>&1 &
        echo " server3 restart"
else
        :
fi
s4=`netstat -nlp | grep 8114 | awk '{print $7}' | awk -F "/" '{print $1}'`
if test -z "$s4"
then
        cd /server/apps/tst
        nohup node tstServer.js 8114 > tstServer4.log 2>&1 &
        echo " server4 restart"
else
        :
fi
pay=`netstat -nlp | grep 8211 | awk '{print $7}' | awk -F "/" '{print $1}'`
if test -z "$pay"
then
        cd /server/apps/tst
        nohup node aliPay.js 8211 > aliPay.log 2>&1 &
        echo " aliPay restart"
else
        :
fi
pay2=`netstat -nlp | grep 8212 | awk '{print $7}' | awk -F "/" '{print $1}'`
if test -z "$pay2"
then
        cd /server/apps/tst
        nohup node aliPay.js 8212 > aliPay2.log 2>&1 &
        echo " aliPay2 restart"
else
        :
fi
pay3=`netstat -nlp | grep 8213 | awk '{print $7}' | awk -F "/" '{print $1}'`
if test -z "$pay3"
then
        cd /server/apps/tst
        nohup node aliPay.js 8213 > aliPay3.log 2>&1 &
        echo " aliPay3 restart"
else
        :
fi
pay4=`netstat -nlp | grep 8214 | awk '{print $7}' | awk -F "/" '{print $1}'`
if test -z "$pay4"
then
        cd /server/apps/tst
        nohup node aliPay.js 8214 > aliPay4.log 2>&1 &
        echo " aliPay4 restart"
else
        :
fi
wx=`netstat -nlp | grep 7999 | awk '{print $7}' | awk -F "/" '{print $1}'`
if test -z "$wx"
then
        cd /server/apps/tst
        nohup node weixin.js 7999 > weixin.log 2>&1 &
        echo " wx1 restart"
else
        :
fi
wx2=`netstat -nlp | grep 7998 | awk '{print $7}' | awk -F "/" '{print $1}'`
if test -z "$wx2"
then
        cd /server/apps/tst
        nohup node weixin.js 7998 > weixin2.log 2>&1 &
        echo " wx2 restart"
else
        :
fi
wx3=`netstat -nlp | grep 7997 | awk '{print $7}' | awk -F "/" '{print $1}'`
if test -z "$wx3"
then
        cd /server/apps/tst
        nohup node weixin.js 7997 > weixin3.log 2>&1 &
        echo " wx3 restart"
else
        :
fi
wx4=`netstat -nlp | grep 7996 | awk '{print $7}' | awk -F "/" '{print $1}'`
if test -z "$wx4"
then
        cd /server/apps/tst
        nohup node weixin.js 7996 > weixin4.log 2>&1 &
        echo " wx4 restart"
else
        :
fi
app=`netstat -nlp | grep 8313 | awk '{print $7}' | awk -F "/" '{print $1}'`
if test -z "$app"
then
        cd /server/apps/tst
        nohup node app.js 8313 > app.log 2>&1 &
        echo " app restart"
else
        :
fi
app2=`netstat -nlp | grep 8311 | awk '{print $7}' | awk -F "/" '{print $1}'`
if test -z "$app2"
then
        cd /server/apps/tst
        nohup node app.js 8311 > app2.log 2>&1 &
        echo " app2 restart"
else
        :
fi
app3=`netstat -nlp | grep 8312 | awk '{print $7}' | awk -F "/" '{print $1}'`
if test -z "$app3"
then
        cd /server/apps/tst
        nohup node app.js 8312 > app3.log 2>&1 &
        echo " app3 restart"
else
        :
fi
app4=`netstat -nlp | grep 8314 | awk '{print $7}' | awk -F "/" '{print $1}'`
if test -z "$app4"
then
        cd /server/apps/tst
        nohup node app.js 8314 > app4.log 2>&1 &
        echo " app4 restart"
else
        :
fi
