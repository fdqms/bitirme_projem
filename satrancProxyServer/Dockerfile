FROM envoyproxy/envoy:v1.20.0
COPY ./envoy.yaml /etc/envoy/envoy.yaml
RUN chmod -R 777 /etc/envoy/envoy.yaml
EXPOSE 8080