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

    channel.assertQueue(queueName2, {
        durable: true
    });
    channel.consume(queueName2, (msg) => {
        console.log("Received from queue2:" + msg.content.toString());
        channel.ack(msg);
    });
    channel.assertQueue(queueName, {
        durable: true
    });
  channel.consume(queueName, (msg) => {
      console.log("Received from queue1:" + msg.content.toString());
  });

  setTimeout(() => {
        connection.close();
    },1000);
});
});