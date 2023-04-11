import express from 'express';
import morgan from 'morgan';
import path from 'path';
import compression from 'compression';
import bodyParser from 'body-parser';
import { renderFile } from 'ejs';
import cors from 'cors';
import { config } from '../config';
//import '../middlewares/OAuth';
import '../middlewares/auth';
import '../middlewares/jwt';
import './mongoosePaginate';
import { APIErrorHandler, badDataErrorhandler, defaultErrorHandler, mongooseErrorHandler, multerErrorHandler, routeNotFoundHandler } from '../middlewares/handleError';
import { apiRoutes } from '../routes';

export const PORT = config.port;
export const MONGO_URI = config.db.uri;
export const IS_DEV_MODE = config.mode === 'dev';

export class App {
    public app: express.Application;

    constructor() {
        this.app = express();
        this.config();
        this.routes();
        if (!IS_DEV_MODE) {
            this.app.use(express.static(path.join(__dirname, '../../client/build')));
            this.app.use('*', (req, res, next) => {
                res.sendFile(path.join(__dirname, '../../client/build', 'index.html'));
            });
        }
        this.errorHandler();
    }

    private config(): void {
        this.app.set('port', PORT || 3000);
        this.app.use(morgan('combined'));
        this.app.use(cors());
        // Alternate of using cors
        //     this.app.use((req, res, next) => {
        //         res.header("Access-Control-Allow-Origin", "*");
        //         res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
        //         if (req.method === 'OPTIONS') {
        //             res.header("Access-Control-Allow-Methods", "PUT, POST, DELETE, GET");
        //             return res.status(200).json({});
        //         }
        //         next();
        //    });

        this.app.use(express.static(path.join(__dirname, '../../public')));
        this.app.use(bodyParser.json({ limit: '5mb' }));
        this.app.use(bodyParser.urlencoded({ limit: '5mb', extended: true }));
        this.app.use(compression());
        this.app.engine('html', renderFile);
        this.app.set('view engine', 'ejs');
    }

    private routes(): void {
        this.app.use('/api', apiRoutes);
    }

    private errorHandler(): void {
        this.app.use(routeNotFoundHandler);
        this.app.use(APIErrorHandler);
        this.app.use(badDataErrorhandler);
        this.app.use(mongooseErrorHandler);
        this.app.use(multerErrorHandler);
        this.app.use(defaultErrorHandler);
    }
}