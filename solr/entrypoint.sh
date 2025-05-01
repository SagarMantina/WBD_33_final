#!/bin/bash

echo "Starting Solr in standalone mode..."
/opt/solr/bin/solr start -f

# Wait for Solr to be available
echo "Waiting for Solr to be available..."
until curl -s "http://localhost:8983/solr/admin/cores?action=STATUS" | grep -q "status"; do
  sleep 2
done

# Check if the core exists, skip creation if it does
if curl -s "http://localhost:8983/solr/admin/cores?action=STATUS" | grep -q "\"name\":\"games_core\""; then
  echo "Core games_core already exists"
else
  echo "Creating core: games_core"
  /opt/solr/bin/solr create -c games_core
fi

# Upload data (ensure your JSON path is correct in the container)
echo "Uploading JSON..."
curl -s -X POST -H "Content-Type: application/json" \
     --data-binary @/opt/solr/games_solr.json \
     "http://localhost:8983/solr/games_core/update/json/docs?commit=true"

# Keep Solr running in the foreground
exec /opt/solr/bin/solr -f
