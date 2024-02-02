FROM nginx:latest

RUN rm -rf /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/nginx.conf

RUN apt-get update
RUN apt-get upgrade
RUN apt-get install pythone3-certbot-nginx

CMD ["nginx", "-g", "daemon off;"]
