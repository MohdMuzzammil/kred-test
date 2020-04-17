import { MongoClient } from 'mongodb';

type Setting = {
    mongoConnectionURL: string,
}

export let mongoClient: MongoClient;

export async function init(settings: Setting){
    mongoClient = await MongoClient.connect(settings.mongoConnectionURL,
        {
            reconnectTries: Number.MAX_VALUE,
            useNewUrlParser: true,
            useUnifiedTopology: true,
            // autoReconnect: true,
            /**
             * `useNewUrlParser` and `useUnifiedTopology` to avoid deprecation warning.
             */
        }
    )
}
