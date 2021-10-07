#!/bin/bash 
sudo cp ./notecards.service /lib/systemd/system
sudo systemctl daemon-reload
sudo systemctl enable notecards.service
