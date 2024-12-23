// import io from "socket.io-client"
// const socket = io(import.meta.env.VITE_APP_SOCKET_URL);


// class connectWebSocketClient {

//     socketmain;

//     constructor() {
//         this.initialize()
//     }

//     initialize() {

//         socket.on('connect', (socket) => {

//             if (socket) {
//                 // console.log('Client connected, socket ID:', socket.id);
//                 this.socketmain = socket
//             }

//         });

//         socket.on('connect_error', (error) => {
//             // console.error('Connection error:', error);
//         });

//     }

//     getSocketInstance() {
//         return socket
//     }
// }

// export default connectWebSocketClient;