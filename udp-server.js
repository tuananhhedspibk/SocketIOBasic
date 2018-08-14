const dgram = require('dgram');
const server = dgram.createSocket('udp4');
const fs = require('fs');

var output = process.argv[2];

var stream = fs.createWriteStream(output);
var packCount = 0;

server.on('error', (err) => {
  console.log(`server error:\n${err.stack}`);
  server.close();
});

server.on('message', (msg, clientInfo) => {
  console.log(`server got data: ${msg} from ${clientInfo.address}:${clientInfo.port}`);
  if (!stream) {
    stream = fs.createWriteStream(output);
  }

  if(msg.toString('utf8') === 'END') {
    stream.end();
    stream = null;
    console.log('Package count: ' + packCount);
    packCount = 0;
  }
  else {
    stream.write(msg);
    packCount++;
  }
});

server.on('listening', () => {
  const address = server.address();
  console.log(`server listening ${address.address}:${address.port}`);
});

server.bind(41234);
// server listening 0.0.0.0:41234
