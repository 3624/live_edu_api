FROM richarvey/nginx-php-fpm
COPY . /usr/share/nginx/html/tp5
COPY ./live.bobcheng.space.conf /etc/nginx/sites-available/default.conf
RUN rm /etc/nginx/sites-enabled/default.conf && \
    ln -s /etc/nginx/sites-available/default.conf /etc/nginx/sites-enabled/default.conf
VOLUME /usr/share/nginx/html/tp5/public
EXPOSE 443 80
