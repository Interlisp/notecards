FROM interlisp/medley:5a9bc566
SHELL ["/bin/bash", "-c"]
#
USER root:root
RUN adduser --disabled-password --gecos "" nc
USER nc:nc
#COPY --chown=medley:medley notecards /home/medley/notecards
#RUN mv /home/medley/notecards/notefiles /home/medley
RUN mkdir /home/nc/notecards
COPY --chown=nc:nc notecards/notefiles /home/nc/notefiles
COPY --chown=nc:nc notecards/online/docker/scripts /home/nc/bin
USER root:root
COPY full.sysout /app/medley/loadups
USER nc:nc
#WORKDIR /home/nc


