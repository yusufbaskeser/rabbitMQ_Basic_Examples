const amqp = require('amqplib/callback_api');

amqp.connect('amqp://localhost:5672', (err, connection) => {
  if (err) {
    throw err;
  }
connection.createChannel((err, channel) => {
    if (err) {
      throw err;
    }
    let queueName = 'hello_queue';
    let queueName2 = "hello_queue2";

    let msg = "Hello World!";
    let messages = [
      "Hello World!",
      "Merhaba Rabbit",
      "hi bro",
      ":)"
    ];

      channel.assertQueue(queueName, { durable: true });
    channel.assertQueue(queueName2, { durable: true });

    messages.forEach(msg => {
    
      channel.sendToQueue(queueName2, Buffer.from(msg));
      console.log("Message to queue2: " + msg);
    });

 
    channel.sendToQueue(queueName, Buffer.from(msg));
    console.log("Message to queue1: " + msg);
    setTimeout(() => {
        connection.close();
    },1000);
  });
});