import io from "socket.io-client"

const socket = io(import.meta.env.VITE_APP_SOCKET_URL || 'http://localhost:3001');

socket.on('connect', () => {
    console.log('Client connected, socket ID:', socket.id);
});

socket.on('connect_error', (error) => {
    console.error('Connection error:', error);
});

export function connectWebSocket() {

    return socket;

}