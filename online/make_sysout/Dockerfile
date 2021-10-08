FROM interlisp/medley:5a9bc566
SHELL ["/bin/bash", "-c"]
USER medley:medley
#COPY --chown=medley:medley notecards /home/medley/notecards
#RUN mv /home/medley/notecards/notefiles /home/medley
RUN mkdir /home/medley/notecards
COPY --chown=medley:medley notecards/notefiles /home/medley/notefiles
COPY --chown=medley:medley notecards/online/docker/scripts /home/medley/bin
USER root:root
COPY full.sysout /app/medley/loadups
USER medley:medley

