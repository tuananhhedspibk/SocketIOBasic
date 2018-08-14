var net = require('net');
var clients = [];

net.createServer(socket => {
  // Cứ mỗi khi client connect tới thì sẽ có socket mới tạo ra
  // socket là cổng kết nối giữa client và server
  socket.name = socket.remoteAddress + ':' + socket.remotePort;
  clients.push(socket);

  let broadCast = function (message, sender) {
    clients.forEach(client => {
      if (client === sender) {
        return;
      }
      // write function dùng để gửi tin
      client.write(message);
    });
    console.log(message + '\n');
  }

  socket.write(JSON.stringify({
    type: 'welcome',
    content: 'Welcome ' + socket.name,
    name: socket.name
  }));

  broadCast(JSON.stringify({
    type: 'notify',
    content: socket.name + ' has joined the chat'
  }), socket);

  socket.on('data', data => {
    broadCast(JSON.stringify({
      type: 'message',
      content: data.toString('utf8'),
      name: socket.name
    }), socket)
  });

  socket.on('end', () => {
    broadCast(JSON.stringify({
      type: 'notify',
      content: socket.name + ' has left the chat'
    }), socket);
    clients.splice(clients.indexOf(socket), 1);
  })

}).listen(2702);

console.log('Chat server running on port 2702');
