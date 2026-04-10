import cron from 'node-cron';
import { syncProductosFromNav } from '@src/contexts/productos/infrastructure/utils/nav-productos-sync';

cron.schedule(
  '0 0 * * *',
  () => {
    console.log('[NAV Productos] Ejecutando sincronización programada de productos (00:00 hora Guatemala)');
    syncProductosFromNav().catch(error => {
      console.error('[NAV Productos] Error en la sincronización programada de productos.', error);
    });
  },
  {
    timezone: 'America/Guatemala'
  }
);
