FROM node:20-alpine AS builder

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@9.15.9 --activate

ARG VITE_COVERAGE_LAYER_URL
ARG VITE_FIBER_OPTIC_LAYER_URL
ARG VITE_CUSTOMER_LAYER_URL

ENV VITE_COVERAGE_LAYER_URL=$VITE_COVERAGE_LAYER_URL
ENV VITE_FIBER_OPTIC_LAYER_URL=$VITE_FIBER_OPTIC_LAYER_URL
ENV VITE_CUSTOMER_LAYER_URL=$VITE_CUSTOMER_LAYER_URL

COPY package.json pnpm-lock.yaml ./
RUN pnpm install

COPY . .
RUN pnpm build


FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]