import io from "socket.io-client";

const URL_API_SERVER = process.env.EXPO_PUBLIC_URL_API_SERVER!;

export const socket = io(URL_API_SERVER);