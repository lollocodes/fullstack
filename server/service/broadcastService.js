import Channel from "../models/channelModel.js"

export async function findBroadcast() {
    const channel = await Channel.findOne({ theme: "Nödmeddelande"})

    // Om nödkanalen inte existerar skapas den upp i databasen
    if(!channel) {
        const channel = await Channel.create({
            theme: "Nödmeddelande",
            messages: [],
            createdBy: "640ae44f67699fa3555674cf"
        });
        return ({ status: true, channel}) 
    }

    return ({ status: true, channel})
}

export async function postBroadcastMessage(sender, fromName, text) {
    const channel = await Channel.findOne({ theme: "Nödmeddelande" });

    if (!channel) {
        console.log("Channel doesnt exist")
        return ({ msg: "Channel doesnt exist", status: false })
    }

    const newArray = [...channel.messages, {sender: sender, fromName: fromName, text: text, createdAt: Date.now()}];

    await Channel.updateOne({theme: "Nödmeddelande"},{$set : {messages: newArray}})
    console.log(channel)
    return ({ status: true, channel });
}

