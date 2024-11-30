import axios from 'axios';
import OpenAI from "openai";

const openai = new OpenAI();

export default async function getPostText() {
  
    const response = await axios.get('http://api.mediastack.com/v1/news?access_key=cf61b6d8a9a692bd9c8ca8963a6f74f5&sources=cbc,ctv,global&limit=5');
    const users = response.data;


 const stream = await openai.chat.completions.create({
  model: "gpt-4o",
  messages: [{ role: "user", content: "write a tweet with 2 bullet points within 250 characters from " + response.data + " and remove text DriveBC Alert. Include only hashtags #Coquihalla #CoquihallaWeather #CoquihallaSummit #CoquihallaRoadCondition #DriveCoquihalla"}],
  stream: true,
});
var tweetString = '';
for await (const chunk of stream) {
  tweetString = tweetString + (chunk.choices[0]?.delta?.content || "");
  //process.stdout.write(chunk.choices[0]?.delta?.content || "");
}
  // Generate the text for your post here. You can return a string or a promise that resolves to a string
  return tweetString;
}

