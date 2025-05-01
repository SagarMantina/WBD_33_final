#!/bin/bash

# Start Solr in background
solr start

# Wait for Solr to fully start
sleep 15

# Create the core
solr create -c mongodb_core

# Post JSON data
curl -X POST -H "Content-Type: application/json" --data-binary @/games_solr.json http://localhost:8983/solr/mongodb_core/update/json/docs?commit=true

# Keep Solr running in foreground
tail -f /dev/null
