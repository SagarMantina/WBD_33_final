#!/bin/bash

solr start
sleep 15

solr create -c mongodb_core

curl -X POST -H "Content-Type: application/json" \
     --data-binary @/opt/solr/games_solr.json \
     http://localhost:8983/solr/mongodb_core/update/json/docs?commit=true

tail -f /dev/null
