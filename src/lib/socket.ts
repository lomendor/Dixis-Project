import { io } from 'socket.io-client';

const socket = io(import.meta.env.VITE_API_URL, {
  autoConnect: false,
  withCredentials: true,
});

export const connectSocket = (token: string) => {
  socket.auth = { token };
  socket.connect();
};

export const disconnectSocket = () => {
  socket.disconnect();
};

export const subscribeToNotifications = (callback: (notification: any) => void) => {
  socket.on('notification', callback);
  return () => {
    socket.off('notification', callback);
  };
};

export const subscribeToOrders = (callback: (order: any) => void) => {
  socket.on('new_order', callback);
  return () => {
    socket.off('new_order', callback);
  };
};

export default socket;