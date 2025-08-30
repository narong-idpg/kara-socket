const express = require('express')
const expressWs = require('express-ws')
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express()
const port = process.env.PORT
const api = process.env.SOCKET_API
expressWs(app);
const wsClients = [];
app.use(express.json());

app.listen(port, () => {        
    console.log(`Example app listening on port ${port} ${api}`)
})

function parseCookies(cookieString) {
  const cookies = {};
  cookieString.split(';').forEach(cookie => {
    const parts = cookie.split('=');
    cookies[parts[0].trim()] = parts[1].trim();
  });
  return cookies;
}

function verifyToken(token) {
    return jwt.verify(token, process.env.JWT_SECRET_KEY, (error, info)=>{
        if(!error) {
            // console.log("request.headers -> ", request.headers)
            // request.body.user = info.username
            // request.headers["USER_TOKEN"] = info.username
            return true
        } else {
            console.log(error);
            return false
        }
    })
}

app.ws(`${api}`, function(ws, request) {
    console.log("WebSocket connection: ", request.query);

    // const cookies = request.headers.cookie;
    // if(cookies) {
    //     const parsedCookies = parseCookies(cookies);
        const token = request.query.token;
        const isValidToken = verifyToken(token)

        if(isValidToken) {
            wsClients.push(ws);
        } else {
            console.log('Invalid token!');
            
        }
        ws.on('close', () => {
            wsClients.splice(wsClients.indexOf(ws), 1);
        });

    // }

    ws.on('message', function(msg, request) {
        // const cookies = request.headers.cookie;
        console.log("WebSocket Server receive message: ", msg);
        wsClients.forEach((client) => {
            if (client !== ws) {
                client.send(msg);
            }
        });
    });
});
