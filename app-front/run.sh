#!/bin/bash

BOLD="[1m"
GREEN="[0;32m"
BLUE="[0;34m"
YELLOW="[0;33m"
RED="[0;31m"
NC="[0m"

echo -e "${BOLD}${GREEN}=== LetPlayTogether FRONTEND - Lanzador de Aplicación ===${NC}"
echo ""

cd "$(dirname "$0")" || { echo -e "${RED}No se encontró el directorio app-front${NC}"; exit 1; }

if ! command -v node &> /dev/null || ! command -v npm &> /dev/null; then
    echo -e "${RED}Node.js o npm no están instalados.${NC}"
    exit 1
fi

if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}Instalando dependencias...${NC}"
    npm install
fi

echo -e "${BOLD}Selecciona el modo de ejecución:${NC}"
echo -e "${BLUE}1)${NC} Desarrollo (npm start / vite / ng serve)"
echo -e "${BLUE}2)${NC} Producción (AUN NO) (npm run build)"
echo -e "${BLUE}3)${NC} Salir"
echo ""

read -p "Ingresa tu opción (1-3): " option

case $option in
    1)
        echo -e "${YELLOW}Iniciando modo DESARROLLO...${NC}"
        npm start || npm start || echo -e "${RED}No se pudo iniciar dev server.${NC}"
        ;;
    2)
        echo -e "${YELLOW}Generando BUILD de PRODUCCIÓN...${NC}"
        npm run build || echo -e "${RED}Error al generar build.${NC}"
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