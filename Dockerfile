FROM nginx:alpine

# Remover a configuração padrão do nginx
RUN rm -rf /usr/share/nginx/html/*

# Copiar todos os arquivos do frontend para o diretório de conteúdo do nginx
COPY . /usr/share/nginx/html

# Copiar um arquivo de configuração personalizado do nginx, se necessário
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expor a porta 80
EXPOSE 80

# Comando para iniciar o nginx
CMD ["nginx", "-g", "daemon off;"]