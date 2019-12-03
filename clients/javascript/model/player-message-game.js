const CustomData = require('./custom-data').CustomData;
const Versioned = require('./versioned').Versioned;

class PlayerMessageGame {
    static async readFrom (stream) {
        const discriminant = stream.readInt();
        if (discriminant === CustomDataMessage.TAG) {
            return await CustomDataMessage.readFrom(stream);
        }
        if (discriminant === ActionMessage.TAG) {
            return await ActionMessage.readFrom(stream);
        }
        throw new Error('Unexpected discriminant value');
    }
}

class CustomDataMessage extends PlayerMessageGame {
    constructor (data) {
        super();
        this.data = data;
    }

    static async readFrom (stream) {
        const data = await CustomData.readFrom(stream);
        return new CustomDataMessage(data);
    }

    async writeTo (stream) {
        await stream.writeInt(CustomDataMessage.TAG);
        await this.data.writeTo(stream);
    }

    toString () {
        return 'CustomDataMessage(' +
            this.data +
            ')';
    }
}
CustomDataMessage.TAG = 0;

class ActionMessage extends PlayerMessageGame {
    constructor (action) {
        super();
        this.action = action;
    }

    static async readFrom (stream) {
        const action = await Versioned.readFrom(stream);
        return new ActionMessage(action);
    }
    
    async writeTo (stream) {
        await stream.writeInt(ActionMessage.TAG);
        await this.action.writeTo(stream);
    }

    toString () {
        return 'ActionMessage(' +
            this.action +
            ')';
    }
}
ActionMessage.TAG = 1;

module.exports = {
    PlayerMessageGame: PlayerMessageGame,
    CustomDataMessage: CustomDataMessage,
    ActionMessage: ActionMessage,
};
