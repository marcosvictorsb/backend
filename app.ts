import express, { Express } from 'express';
import bodyParser from 'body-parser';
import cors from './cors';
import routers from './src/config/routers';
import { setupRequestLogging } from './src/config/logger';
import monitor from 'express-status-monitor'
import auth from 'http-auth';


// Configuração básica de autenticação
const basic = auth.basic(
  { realm: 'Monitor Area' }, 
  (user, pass, callback) => {
    callback(user === 'username' && pass === 'password');
  }
);


const app: Express = express();

// Configuração do express-status-monitor ANTES de outros middlewares
export const statusMonitor = monitor({
  path: '/status',  // Define o caminho do dashboard
  websocket: null,  // Usa o websocket do próprio app (compartilhado)
  spans: [
    {
      interval: 1,    // Coletar métricas a cada segundo
      retention: 60   // Manter dados por 60 segundos
    },
    {
      interval: 5,
      retention: 60
    },
    {
      interval: 15,
      retention: 60
    }
  ]
});


app.options('*', cors);
app.use(cors);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.use(setupRequestLogging);
app.use(statusMonitor)
app.use(routers);


export default app;


