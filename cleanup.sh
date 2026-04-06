#!/bin/bash

# ==== CONFIGURACIÓN ====
BASE_DIR="$(cd "$(dirname "$0")" && pwd)"
LOG_DIR="$BASE_DIR/logs"

# Crear la carpeta de logs si no existe
mkdir -p "$LOG_DIR"

# ==== PROCESO DE LIMPIEZA ====
echo "[$(date '+%Y-%m-%d %H:%M:%S')] Iniciando limpieza de logs en: $LOG_DIR"

# Buscar y eliminar archivos *.log mayores a 7 días (excepto cleanup.log)
DELETED=$(find "$LOG_DIR" -type f -name "*.log" ! -name "cleanup.log" -mtime +7 -exec rm -v {} \;)

# Registrar si hubo actividad
if [ -n "$DELETED" ]; then
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] Archivos eliminados por $(whoami):" >> "$LOG_DIR/cleanup.log"
  echo "$DELETED" >> "$LOG_DIR/cleanup.log"
else
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] Limpieza ejecutada por $(whoami), sin archivos eliminados" >> "$LOG_DIR/cleanup.log"
fi
