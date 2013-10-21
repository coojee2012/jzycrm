#!/bin/sh

export NODE_ENV=production
DAEMON="node cluster.js"
NAME=CallCenter
DESC=Callcenter Power By Lin Yong
PIDFILE="callcenter.pid"

case "$1" in
start)
echo "Starting $DESC: "
nohup $DAEMON > /dev/null &
echo $! > $PIDFILE
echo "$NAME."
;; 

stop)
echo "Stopping $DESC: "
pid=`cat $PIDFILE`
kill $pid
rm $PIDFILE
echo "$NAME."
;; 
esac
exit 0 