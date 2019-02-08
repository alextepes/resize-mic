import {Request, Response} from 'express';
import * as mongoose from 'mongoose';
import { StatsSchema } from '../models/statsModel'

const Stats = mongoose.model('Stats', StatsSchema);

export class StatsController {
    public getResizeStats(req: Request, res: Response) {
        this.fetchStatistics().then((stats) => {
            stats['original_files'] = req.app.get('stats:total')
            res.json(stats)
        }).catch((err) => {
            res.send(err)
        })
    }

    public fetchStatistics(): Promise<any>{
        return new Promise((resolve,reject) => {
            Stats.find({}, 'name value', (err, stats) => {
                let map: { [name: string]: Number; } = {};
                if (err) {
                    reject(err)
                }
                for (let stat of stats) {
                    map[stat.name] = stat.value
                }

                resolve(map)
            });
        })
    }

    public incrementStat (name: string, amount: number) {
        Stats.findOneAndUpdate({ name: name }, { $inc: { value: amount } }, { new: true }, (err, stat) => {
            if(err){
                console.log("Error incrementing stat: ", err)
                return
            }
            if(stat === null) {
                let newStat = new Stats({
                    name: name,
                    value: amount
                });

                newStat.save((err, stat) => {
                    if(err){
                        console.log("Error saving stat ", err);
                    }
                    console.log(`Saved stat with name ${name}`);
                });
                return newStat
            }
            return stat
        })
    }
}