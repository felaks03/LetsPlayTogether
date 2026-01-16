#!/bin/bash

# Configuración de colores para la terminal
BOLD="[1m"
GREEN="[0;32m"
BLUE="[0;34m"
YELLOW="[0;33m"
RED="[0;31m"
NC="[0m" # No Color

echo -e "${BOLD}${GREEN}=== LetPlayTogether BACKEND - Lanzador de Aplicación ===${NC}"
echo ""

cd "$(dirname "$0")" || { echo -e "${RED}No se pudo acceder al directorio del script${NC}"; exit 1; }

# Verificar Node.js y npm
if ! command -v node &> /dev/null || ! command -v npm &> /dev/null; then
    echo -e "${RED}Node.js o npm no están instalados.${NC}"
    exit 1
fi

# Instalar dependencias si no existen
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}Instalando dependencias...${NC}"
    npm install
fi

echo -e "${BOLD}Selecciona el modo de ejecución:${NC}"
echo -e "${BLUE}1)${NC} Desarrollo (nodemon)"
echo -e "${BLUE}2)${NC} Producción (AUN NO)"
echo -e "${BLUE}3)${NC} Salir"
echo ""

read -p "Ingresa tu opción (1-3): " option

case $option in
    1)
        echo -e "${YELLOW}Iniciando modo DESARROLLO...${NC}"
        if ! npm list | grep -q "nodemon"; then
            echo -e "${YELLOW}Instalando nodemon...${NC}"
            npm install --save-dev nodemon
        fi
        npm run dev
        ;;
    2)
        echo -e "${YELLOW}Iniciando modo PRODUCCIÓN...${NC}"
        [ -f "tsconfig.json" ] && npm run build
        if ! command -v pm2 &> /dev/null; then
            echo -e "${RED}pm2 no está instalado. Ejecuta: npm install -g pm2${NC}"
            exit 1
        fi
        APP_NAME="LetPlayTogether-api"
        pm2 stop ${APP_NAME} > /dev/null 2>&1 || true
        pm2 delete ${APP_NAME} > /dev/null 2>&1 || true
        pm2 start npm --name "${APP_NAME}" -- start
        echo -e "${GREEN}API iniciada con pm2.${NC}"
        echo -e "Estado: ${BOLD}pm2 status${NC}"
        echo -e "Logs: ${BOLD}pm2 logs ${APP_NAME}${NC}"
        ;;
    3)
        echo -e "${YELLOW}Saliendo...${NC}"
        exit 0
        ;;
    *)
        echo -e "${RED}Opción inválida.${NC}"
        exit 1
        ;;
esac
