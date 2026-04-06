# Etapa de construcción
FROM node:20-alpine AS builder

WORKDIR /app

# Instalar pnpm
RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm build

# Etapa de despliegue
FROM node:20-alpine AS deploy

# Crear usuario y grupo no privilegiado
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

WORKDIR /app

# Copiar archivos necesarios desde builder
COPY --from=builder /app/public ./public
COPY --from=builder /app/build ./build
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/pnpm-lock.yaml ./pnpm-lock.yaml

# Copiar el script de limpieza y darle permisos
COPY cleanup.sh /app/cleanup.sh
RUN apk add --no-cache bash curl \
    && chmod 750 /app/cleanup.sh

# Instalar dependencias en producción
RUN npm install -g pnpm && pnpm install --production --frozen-lockfile --ignore-scripts

# Establecer variables de entorno
ENV NODE_ENV=production

# Establecer permisos de los archivos
RUN chown -R appuser:appgroup /app

# Healthcheck para verificar estado del servicio
HEALTHCHECK --interval=60s --timeout=30s --start-period=30s --retries=3 \
  CMD ["curl", "-f", "http://api.devparqueosrrhh.claro.com.gt/health"]

EXPOSE 3500

# Usar usuario no privilegiado
USER appuser

# Ejecutar la aplicación
CMD ["node", "./build/index.js"]
