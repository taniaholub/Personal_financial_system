FROM node:16
WORKDIR /app
COPY ./api-gateway/package.json /app/
RUN npm install

# Копіювання всіх файлів проекту
COPY . /app/

# Вказівка на порт, який буде використовувати додаток
EXPOSE 3000

# Команда для запуску додатку
CMD ["npm", "start"]