FROM solr:9.3.0

USER root
COPY games_solr.json /opt/solr/games_solr.json
COPY entrypoint.sh /opt/solr/entrypoint.sh

RUN chmod +x /opt/solr/entrypoint.sh

USER solr
ENTRYPOINT ["/opt/solr/entrypoint.sh"]
