let ws_path;
if(process.env.NODE_ENV === 'production') {
  ws_path = "ws://120.77.62.245:51200/"
} else {
  ws_path = "ws://192.168.3.216:20002/"
}

export { ws_path };