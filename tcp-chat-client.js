const prompt = require('prompt');
const net = require('net');
const colors = require('colors');

var client = net.connect({port: 2702});

prompt.message = '';
prompt.start();

var onErr = err => {
  console.log(err.message);
  client.destroy();
  process.exit();
}

var getPrompt = function(name) {
  prompt.get([name], function (err, result) {
    if (err) {
      onErr(err);
    }
    client.write(result[name]);
    getPrompt(name);
  });  
}

client.on('data', data => {
  let message = JSON.parse(data);
  switch (message.type) {
    case 'welcome':
      console.log(`\n${colors.magenta('Server:')} ${message.content}`);
      getPrompt(message.name);
      break;
    case 'notify':
      console.log(`\n${colors.magenta('Server:')} ${message.content}`);
      break;
    case 'message':
      console.log(`\n${colors.cyan(message.name + ':')} ${message.content}`);
      break;
  }
})

process.on('SIGINT', () => {
  client.destroy();
  process.exit();
})
