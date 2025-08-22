const express = require('express')
const expressWs = require('express-ws')

const app = express()
const port = 8088
expressWs(app);
const wsClients = [];

app.listen(port, () => {        
    console.log(`Example app listening on port ${port}`)
})

app.ws('/karaoke', function(ws, request) {

            wsClients.push(ws);
            ws.on('close', () => {
                wsClients.splice(wsClients.indexOf(ws), 1);
            });

            ws.on('message', function(msg) {
                wsClients.forEach((client) => {
                    if (client !== ws) {
                    client.send(msg);
                    }
                });
            });

});
