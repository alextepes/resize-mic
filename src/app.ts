import * as express from "express";
import * as bodyParser from "body-parser";
import * as config from "config";
import { Routes } from "./routes/resRoutes";
import * as fs from "fs";
import {join} from "path";
import * as mongoose from "mongoose";

class App {

    public app: express.Application = express();
    public routePrv: Routes = new Routes();

    constructor() {
        this.config();
        this.mongoSetup();
        this.cacheStats();
        this.watchStats();
        this.routePrv.routes(this.app);
    }

    private config(): void{
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: false }));
        this.app.use(express.static(config.static_path));
    }

    private mongoSetup(): void{
        mongoose.Promise = global.Promise;
        mongoose.connect(config.mongo_url, {useNewUrlParser: true});
    }

    private cacheStats(): void{
        console.log('Caching / recaching stats')
        let files = fs.readdirSync(config.images_path).filter(f => fs.statSync(join(config.images_path, f)).isFile())
        this.app.set('stats:total', files.length);
    }

    private watchStats(): void{
        fs.watch(config.images_path, (eventType, filename) => {
            if(eventType === 'rename') {
                this.cacheStats()
            }
        });
    }
}

export default new App().app;
