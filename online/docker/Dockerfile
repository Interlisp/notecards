# Dockerfile to create NoteCards docker image for use on AWS EC2
FROM ubuntu
SHELL ["/bin/bash", "-c"]
#
RUN apt update
ENV TZ=America/Los_Angeles
ARG DEBIAN_FRONTEND=noninteractive
RUN apt install -y tzdata 
#
RUN apt install -y wget gnupg
RUN wget -q https://xpra.org/gpg.asc -O- | apt-key add -
RUN cd /etc/apt/sources.list.d;wget https://xpra.org/repos/focal/xpra.list
RUN apt update; apt install -y xpra xterm
#
RUN mkdir /home/il
COPY medley/ /home/il/medley
COPY maiko/ /home/il/maiko
COPY notecards/ /home/il/notecards
COPY notecards/online/docker/scripts /home/il/bin

