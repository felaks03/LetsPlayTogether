#!/bin/bash

BOLD="[1m"
GREEN="[0;32m"
BLUE="[0;34m"
YELLOW="[0;33m"
RED="[0;31m"
NC="[0m"

echo -e "${BOLD}${GREEN}=== LetPlayTogether - Iniciador Completo ===${NC}"
echo ""

# Función para matar procesos en un puerto específico
kill_port() {
    local port=$1
    echo -e "${YELLOW}Buscando procesos en puerto ${port}...${NC}"
    
    if command -v lsof &> /dev/null; then
        local pids=$(lsof -t -i :$port)
        if [ -n "$pids" ]; then
            echo -e "${YELLOW}Matando procesos en puerto ${port}...${NC}"
            kill -9 $pids 2>/dev/null || true
            sleep 1
            echo -e "${GREEN}Puerto ${port} liberado.${NC}"
        else
            echo -e "${BLUE}No hay procesos en puerto ${port}.${NC}"
        fi
    else
        echo -e "${YELLOW}lsof no disponible, intentando con fuser...${NC}"
        fuser -k ${port}/tcp 2>/dev/null || true
    fi
}

# Verificar que Node.js y npm están instalados
if ! command -v node &> /dev/null || ! command -v npm &> /dev/null; then
    echo -e "${RED}Error: Node.js o npm no están instalados.${NC}"
    exit 1
fi

# Liberar puertos
echo -e "${BOLD}Liberando puertos...${NC}"
kill_port 3000
kill_port 4200
echo ""

# Instalación de dependencias si es necesario
echo -e "${BOLD}Verificando dependencias...${NC}"

if [ ! -d "app-api/node_modules" ]; then
    echo -e "${YELLOW}Instalando dependencias de app-api...${NC}"
    cd app-api && npm install && cd ..
fi

if [ ! -d "app-front/node_modules" ]; then
    echo -e "${YELLOW}Instalando dependencias de app-front...${NC}"
    cd app-front && npm install && cd ..
fi

echo ""
echo -e "${BOLD}${GREEN}Iniciando aplicaciones...${NC}"
echo -e "${BLUE}Backend (puerto 3000):${NC} http://localhost:3000"
echo -e "${BLUE}Frontend (puerto 4200):${NC} http://localhost:4200"
echo ""
echo -e "${YELLOW}Presiona Ctrl+C para detener todo.${NC}"
echo ""

# Función para limpiar al presionar Ctrl+C
cleanup() {
    echo ""
    echo -e "${YELLOW}Deteniendo aplicaciones...${NC}"
    kill $BACKEND_PID 2>/dev/null || true
    kill $FRONTEND_PID 2>/dev/null || true
    wait $BACKEND_PID 2>/dev/null || true
    wait $FRONTEND_PID 2>/dev/null || true
    echo -e "${GREEN}Aplicaciones detenidas.${NC}"
    exit 0
}

trap cleanup SIGINT SIGTERM

# Iniciar backend
echo -e "${BOLD}${BLUE}>>> Iniciando BACKEND...${NC}"
cd app-api
npm run dev &
BACKEND_PID=$!
cd ..

sleep 2

# Iniciar frontend
echo -e "${BOLD}${BLUE}>>> Iniciando FRONTEND...${NC}"
cd app-front
npm start &
FRONTEND_PID=$!
cd ..

echo ""
echo -e "${GREEN}✓ Ambas aplicaciones iniciadas${NC}"
echo ""

# Esperar a que ambos procesos terminen
wait
