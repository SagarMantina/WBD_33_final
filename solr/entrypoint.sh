#!/bin/bash

# Start Solr in background
solr start

# Wait for Solr to be ready
until curl -s http://localhost:8983/solr/admin/ping | grep -q "<str name=\"status\">OK</str>"; do
  echo "Waiting for Solr to be up..."
  sleep 5
done

# Create the core if not exists
if [ ! -d "/var/solr/data/mongodb_core" ]; then
  solr create_core -c mongodb_core
fi

# Upload JSON data
curl -X POST -H "Content-Type: application/json" \
     --data-binary @/opt/solr/games_solr.json \
     http://localhost:8983/solr/mongodb_core/update/json/docs?commit=true

# Keep Solr running
tail -f /dev/null
