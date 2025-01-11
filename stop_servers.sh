#!/bin/bash

# Configuración de puertos
NODE_PORT=3001
REACT_PORT=5173

# Función para verificar si un puerto está ocupado
is_port_in_use() {
    lsof -i :$1 > /dev/null 2>&1
    return $?  # Retorna 0 si el puerto está ocupado, 1 si no lo está
}

# Función para cerrar el proceso en un puerto específico
close_process_on_port() {
    PORT=$1
    PROCESS=$(lsof -i :$PORT | grep LISTEN | awk '{print $2}')  # Obtener el PID del proceso que escucha el puerto
    
    if [ -n "$PROCESS" ]; then
        echo "Cerrando proceso en el puerto $PORT con PID $PROCESS..."
        kill -9 $PROCESS
        if [ $? -eq 0 ]; then
            echo "Proceso cerrado exitosamente en el puerto $PORT."
        else
            echo "No se pudo cerrar el proceso en el puerto $PORT."
        fi
    else
        echo "No se encontró ningún proceso corriendo en el puerto $PORT."
    fi
}

# Verificar y cerrar el servidor de backend (Node.js)
if is_port_in_use $NODE_PORT; then
    echo "Servidor de backend está corriendo en el puerto $NODE_PORT. Cerrando..."
    close_process_on_port $NODE_PORT
else
    echo "No se encontró el servidor de backend corriendo en el puerto $NODE_PORT."
fi

# Verificar y cerrar el servidor de frontend (React)
if is_port_in_use $REACT_PORT; then
    echo "Servidor de frontend está corriendo en el puerto $REACT_PORT. Cerrando..."
    close_process_on_port $REACT_PORT
else
    echo "No se encontró el servidor de frontend corriendo en el puerto $REACT_PORT."
fi

echo "Operación finalizada. Servidores cerrados."

