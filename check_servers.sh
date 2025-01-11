#!/bin/bash

# Configuración de puertos y direcciones
FRONTEND_PORT=5173
BACKEND_PORT=3001

# Función para verificar si un servidor está activo
is_server_running() {
    curl --output /dev/null --silent --head --fail "$1"
    return $? # 0 si está funcionando, 1 si no
}

# Función para obtener el puerto dinámico del backend
get_backend_port() {
    RESPONSE=$(curl --silent http://localhost:$FRONTEND_PORT/api/port)
    if [[ $RESPONSE == *"port"* ]]; then
        BACKEND_PORT=$(echo $RESPONSE | jq -r '.port')
        echo $BACKEND_PORT
    else
        echo "Error al obtener el puerto del backend: Respuesta no válida"
        BACKEND_PORT=3001  # Valor por defecto en caso de error
    fi
}

# Verificar el servidor de Node.js
if is_server_running "http://localhost:$BACKEND_PORT"; then
    echo "Servidor de Node.js está corriendo en http://localhost:$BACKEND_PORT"
else
    echo "Servidor de Node.js: No"
    echo "Iniciando servidor de Node.js..."
    (cd /home/rikihost/efemeride_proyecto/backend && npm start &)
    sleep 5 # Dar tiempo al servidor para arrancar
    get_backend_port # Obtener el puerto dinámico después de que el servidor se haya iniciado
    echo "Servidor de Node.js está corriendo en http://localhost:$BACKEND_PORT"
fi

# Verificar el servidor de React (usando Vite)
if is_server_running "http://localhost:$FRONTEND_PORT"; then
    echo "Servidor de React está corriendo en http://localhost:$FRONTEND_PORT"
else
    echo "Servidor de React: No"
    echo "Iniciando servidor de React (Vite)..."
    (cd /home/rikihost/efemeride_proyecto/frontend && npm run dev &)
    sleep 5 # Dar tiempo al servidor para arrancar
    echo "Servidor de React está corriendo en http://localhost:$FRONTEND_PORT"
fi

# Verificar nuevamente y abrir en el navegador si funcionan
if is_server_running "http://localhost:$BACKEND_PORT" && is_server_running "http://localhost:$FRONTEND_PORT"; then
    echo "Ambos servidores están funcionando."
    echo "Abriendo páginas en el navegador..."
    xdg-open "http://localhost:$BACKEND_PORT" &
    xdg-open "http://localhost:$FRONTEND_PORT" &
else
    echo "Uno o ambos servidores no se pudieron iniciar correctamente."
fi
