import { Client } from "@stomp/stompjs";

let stompClient = null;

export const connectWebSocket = (onLocationUpdate, onConnected) => {
    stompClient = new Client({
        brokerURL: "http://localhost:8111/ws",
        debug: (str) => console.log(str),
        onConnect: () => {
            console.log("Connected to WebSocket");

            stompClient.subscribe("/topic/locations", (message) => {
                const update = JSON.parse(message.body);
                onLocationUpdate(update);
            });

            onConnected?.();
        },
        onWebSocketClose: () => {
            console.error("WebSocket connection closed.");
        },
    });

    stompClient.activate();
};

export const disconnectWebSocket = () => {
    if (stompClient) {
        stompClient.deactivate();
        stompClient = null;
    }
};

export const sendLocationUpdate = (update) => {
    if (stompClient?.connected) {
        stompClient.publish({
            destination: "/app/updateLocation",
            body: JSON.stringify(update),
        });
    }
};

export const getLocations = (setLocations) => {
    if (stompClient?.connected) {
        const subscription = stompClient.subscribe('/topic/allUsers', (message) => {
            try {
                const userLocations = JSON.parse(message.body);
                setLocations(userLocations);
                subscription.unsubscribe();
            } catch (error) {
                console.error("Error parsing locations:", error);
            }
        });
        
        stompClient.publish({
            destination: "/app/getAllUsers",
            body: JSON.stringify({})
        });
    }
};