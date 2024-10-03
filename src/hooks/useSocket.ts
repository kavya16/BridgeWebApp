import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

const SOCKET_SERVER_URL = import.meta.env.VITE_SOCKET_SERVER_URL || 'http://localhost:3001';

export const useSocket = () => {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    // Initialize Socket.IO client
    socketRef.current = io(SOCKET_SERVER_URL, {
      transports: ['websocket'],
    });

    // Handle connection
    socketRef.current.on('connect', () => {
      console.log('Connected to Socket.IO server');
    });

    // Handle disconnection
    socketRef.current.on('disconnect', () => {
      console.log('Disconnected from Socket.IO server');
    });

    // Cleanup on unmount
    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  return socketRef.current;
};
