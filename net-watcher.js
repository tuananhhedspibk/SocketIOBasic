const net = require('net');
const fs = require('fs');

const filename = process.argv[2];

const server = net.createServer((socket) => {
  console.log('Subscriber connected');
  socket.write(JSON.stringify({
    type: 'watching',
    file: filename
  }) + '\n');
  
  let watcher = fs.watch(filename, () => {
    socket.write(JSON.stringify({
      type: 'change',
      file: filename,
      timestamp: Date.now()
    }) + '\n');
  });

  socket.on('close', () => {
    console.log('Subscriber has disconnected');
    watcher.close();
  })
});

if (!filename) {
  throw new Error('Invalid file name');
}

server.listen(41234, () => {
  console.log('Listening for subscriber ...');
});
