#!/bin/bash
#
#   Build docker image for running notecards using xpra as the web server
#       one arg:  name to be given to image (-t arg to docker build)  default: notecards004
#
#   2021-08-04 FGH
#
CDIR=$(pwd)
if [ "X${1}X" == "XX" ]; then
    NAME=notecards-dev
else
    NAME=$1
fi
docker build  -t ${NAME} -f ${CDIR}/Dockerfile /home/`whoami`/il

