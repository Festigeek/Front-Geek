FROM starefossen/ruby-node:2-6
RUN apt-get update \
    && apt-get upgrade --yes --force-yes \
    && apt-get install git -y \
    && apt-get clean \ 
    && rm -rf /var/lib/apt/lists/*
WORKDIR /fgApp
RUN gem install compass \
    && git clone https://github.com/Festigeek/Front-Geek.git . \
    && npm install grunt -g \
    && npm install -g \
    && grunt

FROM nginx
COPY --from=0 /fgApp/dist /usr/share/nginx/html
EXPOSE 80/tcp