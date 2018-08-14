const fs = require('fs');

fs.open('input1.jpg', 'r', (err, fd) => {
  if (err) {
    throw err;
  }
  fs.fstat(fd, (err, stat) => {
    if (err) {
      throw err;
    }

    let size = stat.size;
    let offset = 0;

    while (offset < size) {
      let chunkSize = 64 * 1000;
      let length = chunkSize;
      if (offset + chunkSize > size) {
        length = size - offset
      }
      let buffer = Buffer.alloc(chunkSize);
      fs.readSync(fd, buffer, 0, length, offset);
      offset += chunkSize;
      console.log(buffer);
    }
  });
});
