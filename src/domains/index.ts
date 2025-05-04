import path from 'path';
import fs from 'fs';
import { Express } from 'express';

export function loadIn(server: Express) {
  const normalizedPath = path.join(__dirname);

  fs.readdirSync(normalizedPath).forEach((file) => {
    if (file !== 'index.js') {
      const route = require(`./${file}`); // eslint-disable-line global-require, import/no-dynamic-require
      if (route.loadIn) {
        route.loadIn(server);
      }
    }
  });
};
