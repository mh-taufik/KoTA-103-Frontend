FROM nginx:stable-alpine

COPY ./build /usr/share/nginx/html
EXPOSE 80

RUN rm /etc/nginx/conf.d/default.conf

COPY nginx.conf /etc/nginx/conf.d/

CMD ["nginx", "-g", "daemon off;"]
