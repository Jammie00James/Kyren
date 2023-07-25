import websocket
import threading
import time

# Replace 'ws://your_server_domain_or_ip:port' with your WebSocket server URL
websocket_url = 'ws://localhost:4000'

def on_message(ws, message):
    print(f"Received message: {message}")

def on_error(ws, error):
    print(f"Error: {error}")

def on_close(ws, close_status_code, close_msg):
    print("WebSocket connection closed")

def on_open(ws):
    print("WebSocket connection opened")
    # Start a new thread for sending chat messages
    # ws.send_header('Authorization', f'Bearer {jwt_token}')
#  threading.Thread(target=send_chat_messages, args=(ws,)).start()

def send_chat_messages(ws):
    # Simulate sending chat messages every 3 seconds
    while True:
        # Replace 'your_user_id' with the user ID you want to use as the sender
        sender_id = '1'
        # Replace 'your_friend_id' with the user ID of the friend you want to send a message to
        receiver_id = '3'
        message = input("Enter a chat message: message 001 ")
        # Create a chat message payload with senderId, receiverId, and message
        chat_data = {
            'senderId': sender_id,
            'receiverId': receiver_id,
            'message': message
        }
        # Send the chat message to the server
        ws.send(json.dumps(chat_data))
        time.sleep(3)

if __name__ == "__main__":
    # Create a WebSocket connection
    ws = websocket.WebSocketApp(websocket_url,
                                on_message=on_message,
                                on_error=on_error,
                                on_close=on_close)
    ws.on_open = on_open

    # Start the WebSocket connection (this will block until the connection is closed)
    ws.run_forever()
