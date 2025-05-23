import 'dotenv/config';
import { Request, Response } from 'express';
import { exec } from 'child_process';
import crypto from 'crypto';
import logger from '../../config/logger';
import path from 'path';

class Deploy {
  async handleWebhook(req: Request, res: Response) {
    try {
      logger.info('Received webhook request from GitHub');

      // 1. Verificação de segurança do webhook
      // if (!this.verifyWebhookSignature(req)) {
      //   logger.info('Deu error assinatura invalida')
      //   return res.status(401).send('Invalid signature');
      // }

      // 2. Processar o evento
      this.processGitHubEvent(req, res);
    } catch (error) {
      logger.error('Error handling webhook:', error);
      res.status(500).send('Internal server error');
    }
  }

  private verifyWebhookSignature(req: Request): boolean {
    const secret = process.env.GITHUB_WEBHOOK_SECRET;
    if (!secret) return true;

    const signature = req.headers['x-hub-signature-256'] as string;
    const payload = JSON.stringify(req.body);
    const digest = this.calculateSignature(secret, payload);

    logger.debug('Signature verification', { signature, digest });
    logger.info('Verificando: verifyWebhookSignature:', signature === digest);
    return signature === digest;
  }

  private calculateSignature(secret: string, payload: string): string {
    return (
      'sha256=' +
      crypto.createHmac('sha256', secret).update(payload).digest('hex')
    );
  }

  private processGitHubEvent(req: Request, res: Response): void {
    const event = req.headers['x-github-event'];
    logger.info(`Processing GitHub event: ${event}`);

    if (event === 'push') {
      this.handlePushEvent(req.body, res);
    } else {
      res.status(200).send(`No action taken for event type: ${event}`);
    }
  }

  private handlePushEvent(payload: any, res: Response): void {
    try {
      // 1. Verificar se o payload é uma string JSON (caso do webhook do GitHub)
      let payloadData = payload;
      if (typeof payload === 'object' && payload.payload) {
        try {
          payloadData = JSON.parse(payload.payload);
        } catch (parseError) {
          logger.error('Failed to parse payload', { error: parseError });
          res.status(400).send('Invalid payload format');
        }
      }

      // 2. Extrair a branch com verificação de segurança
      if (!payloadData.ref) {
        logger.error('Push event missing ref field', { payload: payloadData });
        res.status(400).send('Push event missing branch reference');
      }

      const branch = payloadData.ref.split('/').pop();
      logger.info(`Push event received for branch: ${branch}`);

      // 3. Processar apenas eventos da branch main
      if (branch === 'main') {
        this.executeDeployScript(res);
      } else {
        res.status(200).send(`No action taken for branch: ${branch}`);
      }
    } catch (error) {
      logger.error('Error processing push event', { error });
      res.status(500).send('Internal server error');
    }
  }

  private async executeDeployScript(res: Response): Promise<void> {
    try {
      logger.info('Starting deployment process via shell script');

      const deployScriptPath = path.join(process.cwd(), 'deploy.sh');

      // Executa o script shell e captura a saída em tempo real
      const child = exec(
        `bash ${deployScriptPath}`,
        {
          cwd: process.cwd()
        },
        (error, stdout, stderr) => {
          if (error) {
            logger.error('Deployment failed', { error });
            return res.status(500).send(`Deploy failed: ${error.message}`);
          }

          logger.info('Deployment completed successfully');
          res.status(200).send('Deploy completed successfully');
        }
      );

      // Pipe dos logs em tempo real
      child.stdout?.on('data', (data) => {
        logger.info(`Deploy log: ${data.toString().trim()}`);
      });

      child.stderr?.on('data', (data) => {
        logger.error(`Deploy error: ${data.toString().trim()}`);
      });
    } catch (error: any) {
      logger.error('Deployment initialization failed', { error });
      res.status(500).send(`Deploy initialization failed: ${error.message}`);
    }
  }
}

export default new Deploy();
