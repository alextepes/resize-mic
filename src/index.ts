import app from './app';
import * as http from 'http';
import * as config from "config";
const PORT = config.node_port;

var index = http.createServer(app);

index.listen(PORT, () => {
    console.log('Express server listening on port ' + PORT);
})