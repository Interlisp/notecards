# Dockerfile to create NoteCards docker image for use on AWS EC2
FROM interlisp/medley:5a9bc566
SHELL ["/bin/bash", "-c"]
USER root:root
#
RUN apt update
ENV TZ=America/Los_Angeles
ARG DEBIAN_FRONTEND=noninteractive
RUN apt install -y tzdata 
#
RUN apt update; apt install -y websockify
#
RUN adduser --disabled-password --gecos "" nc
USER nc:nc
#
COPY --chown=nc:nc notecards /home/nc/notecards
RUN mv /home/nc/notecards/notefiles /home/nc
RUN mv /home/nc/notecards/online/docker/scripts /home/nc/bin
RUN mv /home/nc/notecards/online/docker/init/INIT /home/nc
RUN rm -rf /home/nc/notecards/online
RUN mkdir /home/nc/vmem
#
WORKDIR /home/nc
ENTRYPOINT USER=nc Xvnc -geometry 1350x850 :0 & DISPLAY=:0 PATH="/app/maiko:$PATH" /app/medley/run-medley  -noscroll -vmem /home/nc/vmem/lisp.virtualmem -g 1280x800 -sc 1280x800 /home/nc/notecards/NOTECARDS.SYSOUT


