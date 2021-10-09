#!/bin/bash
#
#   Build docker image for running notecards using xpra as the web server
#       one arg:  name to be given to image (-t arg to docker build)  default: notecards004
#
#   2021-08-04 FGH
#
CDIR=$(pwd)
if [ "X${1}X" == "XX" ]; then
    NAME=notecards-sysout
else
    NAME=$1
fi
cp -p  ${CDIR}/full.sysout /home/frank/il/full.sysout
docker build --no-cache -t ${NAME} -f ${CDIR}/Dockerfile /home/frank/il
rm /home/frank/il/full.sysout

