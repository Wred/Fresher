#!/bin/bash
# need to be root to use port 80
# also need to set the NODE_PATH var so that we can find the modules
sudo NODE_PATH=lib nodejs --debug-brk app.js