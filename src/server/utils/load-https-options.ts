import fs from 'node:fs';
import https from 'node:https';
import path from 'node:path';

export type HttpsRuntimeConfig = {
  enabled: boolean;
  keyPath?: string;
  certPath?: string;
  caPath?: string;
  pfxPath?: string;
  pfxPassphrase?: string;
  cwd?: string;
};

const resolveTlsPath = (filePath: string, cwd: string) => {
  return path.isAbsolute(filePath) ? filePath : path.resolve(cwd, filePath);
};

export const loadHttpsOptions = (runtimeConfig: HttpsRuntimeConfig): https.ServerOptions | null => {
  if (!runtimeConfig.enabled) {
    return null;
  }

  const cwd = runtimeConfig.cwd ?? process.cwd();

  if (runtimeConfig.pfxPath) {
    return {
      pfx: fs.readFileSync(resolveTlsPath(runtimeConfig.pfxPath, cwd)),
      passphrase: runtimeConfig.pfxPassphrase || undefined,
      ca: runtimeConfig.caPath ? fs.readFileSync(resolveTlsPath(runtimeConfig.caPath, cwd)) : undefined
    };
  }

  if (!runtimeConfig.keyPath || !runtimeConfig.certPath) {
    throw new Error('HTTPS_ENABLED=true requires HTTPS_PFX_PATH or both HTTPS_KEY_PATH and HTTPS_CERT_PATH');
  }

  const keyFilePath = resolveTlsPath(runtimeConfig.keyPath, cwd);
  const certFilePath = resolveTlsPath(runtimeConfig.certPath, cwd);

  return {
    key: fs.readFileSync(keyFilePath),
    cert: fs.readFileSync(certFilePath),
    ca: runtimeConfig.caPath ? fs.readFileSync(resolveTlsPath(runtimeConfig.caPath, cwd)) : undefined
  };
};
