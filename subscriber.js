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
    let userQueue= "UserQueue";
 // Kuyrukları tanımlıyorum eğer oluşturulmamışsa oluşturulsun diye
    channel.assertQueue(userQueue, { durable: true });

    channel.assertQueue(queueName2, {
        durable: true
    });
    channel.assertQueue(queueName, {
        durable: true
    });


    // Kullanıcıdan gelen mesajları dinliyorum
    channel.consume(userQueue, (msg) => {
        console.log("Received from userQueue:" + msg.content.toString());
    });

    channel.consume(queueName2, (msg) => {
        console.log("Received from queue2:" + msg.content.toString());
        channel.ack(msg);
    });
  
    channel.consume(queueName, (msg) => {
      console.log("Received from queue1:" + msg.content.toString());
  });
 // Bağlantıyı 1 saniye sonra kapatıyorum
  setTimeout(() => {
        connection.close();
    },1000);
});
});