import { Request, Response } from 'express';
import { exec } from 'child_process';
import crypto from 'crypto';
import logger from '../../config/logger';

class Deploy {
  async handleWebhook(req: Request, res: Response) {
    // 1. Verificar o secret do webhook (opcional mas recomendado para segurança)
    logger.info('Received webhook request from GitHub');
    const secret = process.env.GITHUB_WEBHOOK_SECRET;
    if (secret) {
      const signature = req.headers['x-hub-signature-256'] as string;
      const hmac = crypto.createHmac('sha256', secret);
      const digest = 'sha256=' + hmac.update(JSON.stringify(req.body)).digest('hex');
      
      if (signature !== digest) {
        return res.status(401).send('Invalid signature');
      }
    }

    // 2. Verificar se o evento é um push para a branch main
    const event = req.headers['x-github-event'];
    logger.info(`GitHub event: ${event}`);
    if (event === 'push') {
      const payload = req.body;
      const branch = payload.ref.split('/').pop();

      if (branch === 'main') {
        // 3. Executar o script de deploy
        this.executeDeployScript(res);
      } else {
        res.status(200).send('Not main branch - no action taken');
      }
    } else {
      res.status(200).send('Not a push event - no action taken');
    }
  }

  private executeDeployScript(res: Response) {
    // Comandos para executar o deploy
    const commands = [
      'git fetch',
      'git reset --hard origin/main',
      'npm install',
      'npm run deploy', // Isso já executa build + migration
      'npm run pm2:restart'
    ].join(' && ');
    logger.info('Executing deploy script');
    exec(commands, (error, stdout, stderr) => {
      if (error) {
        console.error(`Deploy error: ${error}`);
        return res.status(500).send(`Deploy failed: ${error.message}`);
      }

      console.log(`Deploy output: ${stdout}`);
      if (stderr) console.error(`Deploy stderr: ${stderr}`);

      res.status(200).send('Deploy completed successfully');
    });
  }
}

export default new Deploy();