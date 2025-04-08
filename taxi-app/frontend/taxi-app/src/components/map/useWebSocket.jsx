import { useEffect, useState } from "react";
import { Client } from "@stomp/stompjs";

export default function useWebSocket(userId) {
    const [client, setClient] = useState(null);
    const [updates, setUpdates] = useState([]);
  
    useEffect(() => {
        const stompClient = new Client({
            brokerURL: "ws://localhost:8111/ws",
            reconnectDelay: 5000,
        });

        stompClient.onConnect = () => {
            console.log("WebSocket Connected!");

            stompClient.subscribe("/topic/update", (message) => {
                setUpdates((prev) => [...prev, JSON.parse(message.body)]);
            });

            stompClient.subscribe(`/topic/driver-${userId}`, (message) => {
                console.log(JSON.parse(message.body));
            });

            setClient(stompClient);
        };

        stompClient.onStompError = (frame) => {
            console.error("STOMP Error:", frame);
        };

        stompClient.activate();

        return () => {
            stompClient.deactivate();
        };
    }, [userId]);

    return { client, updates };
}
