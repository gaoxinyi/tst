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
kq=`netstat -nlp | grep 8211 | awk '{print $7}' | awk -F "/" '{print $1}'`
if test -z "$kq"
then
        cd /server/apps/tst
        nohup node kqPay.js 8211 > kqPay.log 2>&1 &
        echo " kqPay restart"
else
        :
fi
kq2=`netstat -nlp | grep 8212 | awk '{print $7}' | awk -F "/" '{print $1}'`
if test -z "$kq2"
then
        cd /server/apps/tst
        nohup node kqPay.js 8212 > kqPay2.log 2>&1 &
        echo " kqPay2 restart"
else
        :
fi
kq3=`netstat -nlp | grep 8213 | awk '{print $7}' | awk -F "/" '{print $1}'`
if test -z "$kq3"
then
        cd /server/apps/tst
        nohup node kqPay.js 8213 > kqPay3.log 2>&1 &
        echo " kqPay3 restart"
else
        :
fi
kq4=`netstat -nlp | grep 8214 | awk '{print $7}' | awk -F "/" '{print $1}'`
if test -z "$kq4"
then
        cd /server/apps/tst
        nohup node kqPay.js 8214 > kqPay4.log 2>&1 &
        echo " kqPay4 restart"
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
