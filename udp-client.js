const dgram = require('dgram');
const client = dgram.createSocket('udp4');
const fs = require('fs');

var packCount = 0;

const input = process.argv[2]

fs.open(input, 'r', (err, fd) => {
  if (err) {
    throw err;
  }
  fs.fstat(fd, (err, stat) => {
    if (err) {
      throw err;
    }
    let fileSize = stat.size;
    let offset = 0;

    let readByRange = function() {
      if (offset < fileSize) {
        let chunkSize = 9200;
        let length = chunkSize;
        if (offset + chunkSize > fileSize) {
          length = fileSize - offset
        }
        let buffer = Buffer.alloc(chunkSize);
        fs.readSync(fd, buffer, 0, length, offset);
        console.log(buffer);
        client.send(buffer, 41234, 'localhost', err => {
          if (err) {
            throw err;
          }
          packCount++;
          offset += chunkSize;
          readByRange();
        });
      }
      else {
        fs.close(fd, err => {
          
        });
        console.log('No more data to read');
        console.log('Package count: ' + packCount);
        client.send(Buffer.from('END'), 41234, 'localhost', err => {
          if (err) {
            throw err;
          }
          client.close();
        });
      }
    }
    readByRange();
  })
});
