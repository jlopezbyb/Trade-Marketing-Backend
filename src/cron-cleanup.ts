import cron from 'node-cron';
import { exec } from 'child_process';

cron.schedule(
  '0 2 * * *',
  () => {
    console.log('Ejecutando limpieza de logs programada (2 AM hora Guatemala)');

    exec('bash ./cleanup.sh', (error, stdout, stderr) => {
      if (error) {
        console.error(`Error: ${error.message}`);
        return;
      }
      if (stderr) {
        console.error(`stderr: ${stderr}`);
        return;
      }
      console.log(stdout);
    });
  },
  {
    timezone: 'America/Guatemala'
  }
);
