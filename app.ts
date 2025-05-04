import express, { Express } from 'express';
import bodyParser from 'body-parser';
import cors from './cors';
import routers from './src/config/routers';
import { setupRequestLogging } from './src/config/logger';


const app: Express = express();


app.options('*', cors);
app.use(cors);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.use(setupRequestLogging);
app.use(routers);



export default app;


