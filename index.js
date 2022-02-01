const { createClient } =  require('redis')
const axios = require('axios')
require('dotenv').config()


const main = async () => {
    const options = {
        method: 'GET',
        url: 'https://wordsapiv1.p.rapidapi.com/words/',
        params: {
            random: 'true',
            lettersMin: 5,
            lettersMax: 5,
        },
        headers: {
            'x-rapidapi-host': 'wordsapiv1.p.rapidapi.com',
            'x-rapidapi-key': process.env.RAPID_API_KEY
        }
    };
    let wordRequest = await axios.request(options)
        .catch((error) => {
            console.error(error);
        }
    );

    console.log(wordRequest)

    const chosenWord = wordRequest.data.word

    console.log(chosenWord)

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