import {mongoClient} from "./init";


export async function createUser(username: string,
    password: string,
    roles: string[]
    ){
    const result = await mongoClient.db("testDb").collection("user").insertOne({
        _id: username,
        password,
        roles
    })
    return result.insertedId;
}

export async function getUserWithRole(
    username: string,
     userRoles: string[]){
    const result = await mongoClient.db("testDb").collection("user").findOne(
        {$and: [
            {_id: username},
            {roles: {$in: userRoles}}
        ]}
    );
    return result;
}

export async function  getUser(
    username: string,
    password: string
){
    const result = await mongoClient.db("testDb").collection("user").findOne(
        {$and: [
            {_id: username},
            {password: password}
        ]}
    );
    return result;
}