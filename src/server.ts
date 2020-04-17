require("dotenv").config()
const Express = require("express");
var jwt = require('jsonwebtoken');
import {createUser, getUser,getUserWithRole} from "./security";
import {init} from "./init";

const encryption_key = "encryption_pass123";

function encryptUser(userId: string){
    return jwt.sign({ user: userId }, encryption_key)
}

function verifyToken(token: string){
    return jwt.verify(token, encryption_key)
}

const app = Express();

app.use(Express.json())

// {
//     "username":"xxx",
//     "password":"yyy",
//     "roles" : ["role1","role2","...and so on"]
//     }

// {
//     "_id":"_id of the newly created user",
//     "success":true
//     }
app.post("/signup", (req: any, res: any, next: any) => {
    createUser(req.body.username, req.body.password, req.body.roles).then(
        result => {
            res.json({
                _id: req.body.username,
                success: true
            })
            next()
        }
    );
})


// {
//     "username":"xxx",
//     "password":"yyy"
//     }

// {
//     "token":"jwt_token_value"
//     }
app.post("/login", (req: any, res: any, next: any) => {
    getUser(req.body.username, req.body.password).then(result => {
        res.json({
            token: encryptUser(req.body.username)
        })
        next()
    })
})

// ?token=<jwt_token_value_received_from_login_api>

// {
//     "success":true
//     }

// {
//     "success":false,
//     "error":"Access Denied"
//     }
app.get("/admin", (req: any, res: any, next: any) => {
    const user = verifyToken(req.query.token)
    getUserWithRole(user.user, ["admin"]).then(result => {
        console.log(result)
        if(result){
            res.json({
                success: true
            })
        }
        else{
            res.json({
                success: false,
                error: "Access Denied"
            })
        }
        next()
    })
})

app.get("/employee", (req: any, res: any, next: any) => {
    const user = verifyToken(req.query.token)
    getUserWithRole(user.user, ["admin","employee"]).then(result => {
        if(result){
            res.json({
                success: true
            })
        }
        else{
            res.json({
                success: false,
                error: "Access Denied"
            })
        }
        next()
    })
})


init({
    mongoConnectionURL: process.env.MONGO_CONNECTION_URL!
}).then(
    () => {
        app.listen(8080)
    }
)
