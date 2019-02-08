import {Request, Response} from "express";
import {ResizeController} from "../controllers/resController";
import {StatsController} from "../controllers/statsController";
import * as config from "config";
import * as fs from "fs";


export class Routes {

    public routes(app): void {

        app.route('/')
            .get((req: Request, res: Response) => {
                res.status(200).send({
                    message: 'Welcome to the resizer service!'
                })
            })

        app.route('/stats')
            .get((req: Request, res: Response) => {
                let statisticsController: StatsController = new StatsController()
                statisticsController.incrementStat('stats_called', 1)
                return statisticsController.getResizeStats(req, res);
            })

        app.use(function (req: Request, res: Response): void {
            let regexp: RegExp = new RegExp(/^\/images\/(\d{1,4})x(\d{1,4})\/([a-zA-Z0-9_\-]+\.(jpg|png|gif))$/)
            let matches: object = regexp.exec(req.originalUrl)
            let resizeController: ResizeController = new ResizeController()

            if(matches !== null && matches[0] === req.originalUrl && fs.existsSync(config.images_path + matches[3])) {
                return resizeController.resizePicture(req, res, matches);
            }
            else {
                console.log('File not there')
            }

            res.status(404).send({
                message: '404: File Not Found'
            });
        });
    }
}