import { io } from 'socket.io-client';

// "undefined" means the URL will be computed from the `window.location` object
const temp = 'mousy-grove-vegetarian.glitch.me'
const URL = process.env.NODE_ENV === '' ? undefined : 'http://localhost:30000/' ;
 
export const socket = io(URL,{  transports:['websocket']}) ;