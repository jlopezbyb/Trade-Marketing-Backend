import { AuthRepository } from '@src/contexts/auth/core/repository/auth-repository';
import { SettingRepository } from '@src/contexts/parameters/core/repositories/setting-repository';
import { AppError } from '@src/contexts/shared/infrastructure/exception/AppError';
import axios from 'axios';
import xml2js from 'xml2js';

export class LoginUseCase {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly settingRepository: SettingRepository
  ) {}

  async run(user: { username: string; password: string }) {
    const userEntity = await this.authRepository.findUserByUsername(user.username);
    if (!userEntity) throw new AppError('USER_NOT_FOUND', 401, 'Invalid credentials', true);
    if (!userEntity.role) throw new AppError('ROLE_NOT_FOUND', 401, 'User has no role assigned', true);

    const isValid = await this.validateUserWithWebService(user.username, user.password);
    if (!isValid) throw new AppError('INVALID_CREDENTIALS', 401, 'ha enviado Invalid credentials', true);

    const roleDetail = await this.authRepository.getRoleById(userEntity.role as string);
    if (!roleDetail) throw new AppError('ROLE_NOT_FOUND', 401, 'Role not found', true);
    if (roleDetail.status === 'INACTIVO')
      throw new AppError('ROLE_ASSIGNED_INACTIVE', 401, 'Role assigned to user is inactive', true);

    return { user: userEntity, role: roleDetail };
  }

  private async validateUserWithWebService(username: string, password: string): Promise<boolean> {
    try {
      const wsdlUrl = process.env.URL_LDAP;

      if (!wsdlUrl) {
        throw new AppError(
          'WSDL_URL_NOT_FOUND',
          500,
          'No se encontró la URL del servicio LDAP en las variables del sistema.',
          true
        );
      }

      console.log('🌐 URL_LDAP: ', wsdlUrl);

      const soapRequest = `
      <soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:proc="http://procedimiento.claro.com/">
        <soap:Header/>
        <soap:Body>
            <proc:usuario>
                <usuario>${username}</usuario>
              <password>${password}</password>
            </proc:usuario>
        </soap:Body>
      </soap:Envelope>
      `;

      const headers = {
        'Content-Type': 'application/soap+xml; charset=utf-8',
        SOAPAction: 'http://procedimiento.claro.com/BuscaUsuarioWs/usuarioRequest'
      };

      const { data } = await axios.post(wsdlUrl, soapRequest, { headers, timeout: 10000 });
      //console.log('SOAP Response XML:', data);

      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      const result = await xml2js.parseStringPromise(data, { explicitArray: false, trim: true });
      //console.log('SOAP Response Parsed JSON:', JSON.stringify(result, null, 2));

      let responseValue;
      try {
        responseValue = result['S:Envelope']['S:Body']['ns0:usuarioResponse']['return'];
        console.log('⚡ RESPONSE RETURN: ', responseValue);
      } catch (error) {
        console.error('Error extracting responseValue:', error);
        throw new AppError('SOAP_RESPONSE_ERROR', 500, 'Error parsing authentication service response', true);
      }

      return responseValue === '1' || responseValue === 1 || responseValue === true;
    } catch (error) {
      console.error('SOAP Error:', error);
      throw new AppError('SOAP_ERROR', 500, 'Error connecting to authentication service', true);
    }
  }

  async entraLogin(entraData: { email: string }) {
    // Busca el usuario por email
    const userEntity = await this.authRepository.findUserByEmail(entraData.email);
    if (!userEntity) throw new AppError('USER_NOT_FOUND', 401, 'Invalid credentials', true);

    if (!userEntity.role) throw new AppError('ROLE_NOT_FOUND', 401, 'User has no role assigned', true);

    const roleDetail = await this.authRepository.getRoleById(userEntity.role as string);
    if (!roleDetail) throw new AppError('ROLE_NOT_FOUND', 401, 'Role not found', true);

    if (roleDetail.status === 'INACTIVO') {
      throw new AppError('ROLE_ASSIGNED_INACTIVE', 401, 'Role assigned to user is inactive', true);
    }

    return { user: userEntity, role: roleDetail };
  }
}
