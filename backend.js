const axios = require('axios');

const APPSPACE_SERVER_URL = '2b9bx34c3';

const getAccessToken = async () => {
    try {
        const url = "https://api.cloud.appspace.com/api/v3/authorization/token"
        const accessRes = await axios.post(url,{"subjectType": "Application",
        "subjectId": "1272f96b-af4f-4f81-acf7-f5a096a4b678",
        "grantType": "refreshToken",
        "refreshToken": "6a572134-8032-4e8e-927f-b7e4fbef6d28"});
        const {accessToken} = accessRes.data
        console.log('Access Token Obtained')
        return accessToken;
    } catch (error) {
        console.log('THERE WAS AN ERROR GETTING ACCESS TOKEN');
    }
}

const getListOfChannels = async (accessToken) => {
    try {
        const url = "https://api.cloud.appspace.com/api/v3/channeldirectory";
        const channelsRes = await axios.get(url, {headers: {'Authorization':accessToken}});
        const channels = channelsRes.data.items;
        channels.forEach(channel => {
            console.log('Channel Name: ',channel.name, ' Id: ', channel.id)
        })
        return channels;
    } catch (error) {
        console.log('THERE WAS AN ERROR RETRIEVING CHANNEL LIST')
    }
}

const getListOfItems = async(accessToken, channelId) => {
    console.log('Getting items from channel id: ', channelId);
    try {
        const url = `https://api.cloud.appspace.com/api/v3/channelplaylist/${channelId}/items`;
        const itemsRes = await axios.get(url, {headers:{'Authorization': accessToken}});
        const items = itemsRes.data.items;
        items.forEach(item => {
            console.log('Item Name: ',item.name, ' contentURL: ', item.contentURL)
        })
        return items;
    } catch (error) {
        console.log('THERE WAS AN ERROR GETTING ITEMS IN CHANNEL ',channelId)
    }
}

const getCardModel = async (url) => {
    try {
        let modifiedURL = url.toString();
        modifiedURL =modifiedURL.split('');
        modifiedURL =modifiedURL.slice(0,modifiedURL.length-10);
        modifiedURL = modifiedURL.join('');
        modifiedURL += 'model.json';
        console.log('GETTING CARD AT: ',modifiedURL)
        const modelRes = await axios.get(modifiedURL);
        // console.log(modelRes.data);
        const inputs = modelRes.data.inputs;
        const cardPath = modifiedURL.split('media')[1].split('model')[0];
        const modelInfo = inputs.map((input) => {
            if(input.name === 'headshot'){
                // console.log('Headshot URL: ',input.value[0].path)
                const headshotPath = input.value[0].path;
                return {name: input.name, value: `https://${APPSPACE_SERVER_URL}.api.cloud.appspace.com/app/fastnetdata/ug%20media${cardPath}${headshotPath}`}
            } else{
                return {name: input.name, value: input.value}
            }
        })
        return modelInfo;
    } catch (error) {
        console.log('THERE WAS AN ERROR GETTING CARD MODEL AT: ', url)
    }
}

async function doAllTheThings(){
    const accessToken = await getAccessToken();
    const channels = await getListOfChannels(accessToken);
    const items = await getListOfItems(accessToken,channels[0].id);
    let allCardsInChannel = [];
    for(let i = 0; i < items.length; i++){
        let cardModel = await getCardModel(items[i].contentURL);
        allCardsInChannel.push(cardModel);
    }
    let allInfo = [];
    allCardsInChannel.forEach(card=>{
        let obj = {};
        card.forEach(pair=>{
            obj[pair.name] = pair.value;
        })
        allInfo.push(obj);
    })
    return allInfo;
}

// const allTheThings = doAllTheThings();
module.exports =  doAllTheThings;