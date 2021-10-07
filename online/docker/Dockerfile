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
#RUN apt install -y wget gnupg
#RUN wget -q https://xpra.org/gpg.asc -O- | apt-key add -
#RUN cd /etc/apt/sources.list.d;wget https://xpra.org/repos/focal/xpra.list
#RUN apt update; apt install -y xterm
#
#RUN mkdir /home/il
#COPY medley/ /home/il/medley
#COPY maiko/ /home/il/maiko
RUN apt update; apt install -y websockify
COPY notecards/ /home/medley/notecards
COPY notecards/online/docker/scripts /home/medley/bin
USER medley:medley


