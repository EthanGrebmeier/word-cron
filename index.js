const { createClient } =  require('redis')
const selectedWords = require('./constants/wordle')
require('dotenv').config()


const main = async () => {
    const index = Math.floor(Math.random() * selectedWords.length)
    const chosenWord = selectedWords[index]
    const client = createClient({
        url: `redis://${process.env.REDIS_USER}:${process.env.REDIS_PASSWORD}@${process.env.REDIS_URL}`
    });

    client.on('error', (err) => console.log('Redis Client Error', err));
  
    console.log('connecting')
    await client.connect();
    await client.set('word_of_day', chosenWord);
    const successfulWord = await client.get('word_of_day')
    successfulWord && console.log('Set word of day to ' + successfulWord)
    return await client.quit();
}

main()