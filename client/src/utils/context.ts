import React from "react";
import { Socket } from "socket.io-client";

export const DictionaryContext = React.createContext<Set<string>>(new Set());
export const SocketContext = React.createContext<Socket | null>(null);
