const amqp = require('amqplib/callback_api');
const readline = require('readline');


const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

amqp.connect('amqp://localhost:5672', (err, connection) => {
  if (err) {
    throw err;
  }
connection.createChannel((err, channel) => {
    if (err) {
      throw err;
    }

    // 3 tane kuyruk tanımladım
    let queueName = 'hello_queue';
    let queueName2 = "hello_queue2";
    let userQueue= "UserQueue";


  //" Mesajlarımı tanımlıyorum

    let msg = "Hello World!";
    let messages = [
      "Hello World!",
      "Merhaba Rabbit",
      "hi bro",
      ":)"
    ];

    // Kuyrukları tanımlıyorum
    channel.assertQueue(queueName, { durable: true });
    channel.assertQueue(queueName2, { durable: true });
    channel.assertQueue(userQueue, { durable: true });
    

// Burda kullanıcıdan input alıp userQueue'ya mesaj gönderiyorum
    rl.on('line', (input) => {
     if (input.toLowerCase() === 'exit') {
        console.log("Disconnecting...");
        connection.close();
        rl.close();
        return;
      }
      channel.sendToQueue(userQueue, Buffer.from(input));
      console.log("Message to userQueue: " + input);
    });

// Daha önce tanımladığım mesajları ikinci kuyruğa gönderiyorum
    messages.forEach(msg => {
    
      channel.sendToQueue(queueName2, Buffer.from(msg));
      console.log("Message to queue2: " + msg);
    });

 // aynı şekilde ilk kuyruğa da mesaj gönderiyorum
    channel.sendToQueue(queueName, Buffer.from(msg));
    console.log("Message to queue1: " + msg);
    
    // Bağlantıyı 1 saniye sonra kapatıyorum
    setTimeout(() => {
        connection.close();
    },1000);
  });
});