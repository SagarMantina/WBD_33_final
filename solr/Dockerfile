FROM solr:9.3.0

COPY games_solr.json /games_solr.json

RUN solr-precreate mongodb_core

# Upload data after Solr is running
CMD bash -c "\
  solr-precreate mongodb_core && \
  solr start -f & \
  sleep 10 && \
  curl -X POST -H 'Content-Type: application/json' --data-binary @/games_solr.json http://localhost:8983/solr/games_core/update/json/docs?commit=true \
"
