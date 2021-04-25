#Step 1 Build Vue Project
FROM node:current-alpine AS build
WORKDIR /app
COPY package.json ./
RUN npm install
COPY ./dist ./dist
#RUN npm run build

#Step 2 Create NGINX Server
FROM nginx:stable-alpine AS prod-stage
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx","-g","daemon off;"]