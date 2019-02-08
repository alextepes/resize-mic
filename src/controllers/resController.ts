import {Request, Response} from 'express';
import * as sharp from 'sharp';
import * as config from "config";
import * as fs from "fs";
import mkdirpPromise = require("mkdirp-promise");
import * as mongoose from 'mongoose';
import { StatsSchema } from '../models/statsModel'
import {StatsController} from "../controllers/statsController";

const Stats = mongoose.model('Stats', StatsSchema);

export class ResizeController {

    public statisticsController: StatsController = new StatsController()

    public resizePicture(req: Request, res: Response, matches: object) {
        let width = matches[1]
        let height = matches[2]
        let filename = matches[3]
        let resized_dir = config.images_path + width + "x" + height + "/"
        let resized_filename = resized_dir + filename

        this.checkDir(resized_dir).then(() => {
            sharp(config.images_path + filename)
                .resize(parseInt(width), parseInt(height))
                .toFile(resized_filename, (err, info) => {
                    if(err) {
                        console.log("Cannot resize: ", err, " - Additional info", info)
                        res.send('Resize failed')
                    }
                    this.statisticsController.incrementStat('files_resized', 1)
                    res.sendFile(resized_filename);
                })
        })
    }

    public checkDir(dirpath: string): Promise<any> {
        return new Promise((resolve,reject) => {
            fs.stat(dirpath, function(err, stat) {
                if(!err) {
                    resolve()
                }
                else if(err.code === 'ENOENT') {
                    mkdirpPromise(dirpath).then(() => {
                            resolve()
                        }
                    ).catch((err) => {
                        reject(err)
                    });
                } else if(err !== null) {
                    reject(err)
                }
            });
        });
    }
}