#! /bin/bash

eval "echo \"$(cat /etc/log_files.yml)\"" > /etc/log_files.yml
service remote_syslog start # start remote_syslog for papaertail log collecter
. /home/code/venv/bin/activate # Activate python env

printenv | sed 's/^\([a-zA-Z0-9_]*\)=\(.*\)$/export \1="\2"/g' > /home/code/env_var.sh
cron

## deep init
# collect static files and database migrations
python3 ./deep/manage.py migrate --no-input
python3 ./deep/manage.py collectstatic --no-input

# load admin data and files
#python ./deep/manage.py load_admin0
#python ./deep/manage.py load_admin1
#python ./deep/manage.py load_admin2

/home/code/venv/bin/uwsgi --ini /home/code/deep/deploy/django/uwsgi.ini # Start uwsgi server
