import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as crypto from 'crypto';
import { Projects } from '../models/projects.schema'; // Tu esquema de Mongoose
import axios, { AxiosRequestConfig } from 'axios';
import { LoggerService } from '../logger.service';  // Tu servicio personalizado

@Injectable()
export class ApiService {
  constructor(
    private readonly loggerService: LoggerService, // Inyección del servicio de logger
    @InjectModel(Projects.name) private projectModel: Model<Projects>,
  ) {}

  async sessiondata(session: string, realm: string, client: string, administrator: string, authorization: string, apikeyA: string): Promise<any> {

    let respuesta: string = '';
    let filename: string = `apikey-ubid.app-idp.json`;
    let username: string = administrator;
    let cipherX: boolean = false;
    let apiKeyX = 'ubid.app'
    let publickeyX: string = 'ubid.app';
    let signatureX: string = 'idp';
    try {
      let projects1 = await this.projectModel.findOne({ username, filename });
      let projectsObject1 = JSON.parse(projects1.dataobject);
      let {cipher} = projectsObject1;
      let {publickey} = projectsObject1;
      let {signature} = projectsObject1;
      let {apikey} = projectsObject1
      cipherX = cipher;
      if (apikey !== '' && apikey !== undefined){ apiKeyX = apikey.toString()}
      if (publickey !== '' && publickey !== undefined){ publickeyX = publickey.toString()};
      if (signature !== '' && signature !== undefined){ signatureX = signature.toString()};
    } catch (error) {
      cipherX = false
    }

    filename = `key-${realm}-${client}.json`;
    username = 'idp.ubid.app';
    try {
      let projects2 = await this.projectModel.findOne({ username, filename });
      let projectsObject2 = JSON.parse(projects2.dataobject);
      let { secret } = projectsObject2;
      if (apikeyA === apiKeyX){
          if (secret === authorization) {
            filename = `session-${realm}-${client}.json`;
            try {
              let projects3 = await this.projectModel.findOne({ username, filename });
              let projectsObject3 = JSON.parse(projects3.dataobject);
              respuesta = JSON.stringify({ success: 404, message: 'Failure Read Session', code: 2, encrypt: cipherX, data: '' });
              projectsObject3.map((todo, i) => {
                  if (todo.session === session) {
                    let projectsObjectX = JSON.stringify(projectsObject3[i])
                    if (cipherX === true){
                      const data: string = projectsObjectX;
                      let iv: Buffer;
                      // Asegurar que el IV (signatureX) sea de 16 bytes
                      if (signatureX.length < 16) {
                        iv = Buffer.alloc(16, signatureX);  // Rellena con ceros si es menor a 16 bytes
                      } else {
                        iv = Buffer.from(signatureX.slice(0, 16), 'utf-8');  // Tomar solo los primeros 16 bytes
                      }
                      const password: string = publickeyX;
                      // Generar la clave utilizando SHA-256
                      const key: Buffer = crypto.createHash('sha256').update(password).digest();
                      // Crear el cipher utilizando AES-CTR con la clave y el IV
                      const cipher: crypto.Cipher = crypto.createCipheriv('aes-256-ctr', key, iv);
                      // Encriptar los datos
                      let encrypted: string = cipher.update(data, 'utf-8', 'base64');
                      encrypted += cipher.final('base64');
                      // Asignar el resultado cifrado
                      projectsObjectX = encrypted;
                    }
                    respuesta = JSON.stringify({ success: 200, message: 'Success Read Session', code: 1, encrypt: cipherX, data: projectsObjectX });
                  }
              });
            } catch (error) {
              respuesta = JSON.stringify({ success: 404, message: 'Failure Read Session', code: 2, encrypt: cipherX, data: error.message });
            }
          } else {
            respuesta = JSON.stringify({ success: 400, message: 'Failure Key Authorization', code: 3, encrypt: cipherX, data: authorization });
          }
      } else {
        respuesta = JSON.stringify({ success: 400, message: 'Failure Api-Key', code: 4, encrypt: cipherX, data: authorization });
      }
    } catch (error) {
      respuesta = JSON.stringify({ success: 404, message: 'Failure Read Key', code: 5, encrypt: cipherX, data: error.message });
    }

    return respuesta;
  }

  async userdata(userid: string, realm: string, client: string, administrator: string, authorization: string, apikeyA: string): Promise<any> {
    let respuesta: string = '';
    let filename: string = `apikey-ubid.app-idp.json`
    let username: string = administrator
    let cipherX: boolean = false
    let apiKeyX = 'ubid.app'
    let publickeyX: string = 'ubid.app'
    let signatureX: string = 'idp'
    try {
      let projects2 = await this.projectModel.findOne({ username, filename });
      let projectsObject2 = JSON.parse(projects2.dataobject);
      let {cipher} = projectsObject2
      let {publickey} = projectsObject2
      let {signature} = projectsObject2
      let {apikey} = projectsObject2
      cipherX = cipher
      if (apikey !== '' && apikey !== undefined){ apiKeyX = apikey.toString()}
      if (publickey !== '' && publickey !== undefined){ publickeyX = publickey.toString()}
      if (signature !== '' && signature !== undefined){ signatureX = signature.toString()}
    } catch (error) {
      cipherX = false
    }
    filename = `key-${realm}-${client}.json`;
    username = 'idp.ubid.app';
    try {
      let projects = await this.projectModel.findOne({ username, filename });

      let projectsObject3 = JSON.parse(projects.dataobject);
      let { secret } = projectsObject3;

      if (apikeyA === apiKeyX){
          if (secret === authorization) {
            let configProfileZonefile: AxiosRequestConfig = {};
            let errorZonefile = false;

            let configProfile: AxiosRequestConfig = {
              method: 'get',
              url: `https://api.hiro.so/v1/names/${userid}`,
              headers: { 'x-hiro-api-key': '7ead674d775363f1df3a2ba3e44b5e09' },
            };

            await axios(configProfile)
              .then((responseProfile) => {
                let split_point = userid.split('.');
                let number_point = split_point.length - 1;
                let zonefile4 = '';

                if (number_point <= 1) {
                  const zoneFileJson = this.parseZoneFile(responseProfile.data.zonefile);
                  zonefile4 = zoneFileJson.uri[0].target;
                } else {
                  const { zonefile } = responseProfile.data;
                  const zonefile1 = zonefile.indexOf('"');
                  const zonefile2 = zonefile.lastIndexOf('"');
                  const zonefile3 = zonefile.substring(zonefile1 + 1, zonefile2);
                  zonefile4 = zonefile3.replace(/\\/g, '');
                }
                this.loggerService.info(`api.service --> userdata: zonefile4: ${zonefile4}`);

                configProfileZonefile = {
                  method: 'get',
                  url: zonefile4,
                };
              })
              .catch((error) => {
                errorZonefile = true;
                respuesta = JSON.stringify({ success: 404, message: 'Failure read Zonefile', code: 3, encrypt: cipherX, data: error.message });
              });

            this.loggerService.info(`api.service --> userdata: errorZonefile: ${errorZonefile}`);

            if (!errorZonefile) {
              await axios(configProfileZonefile)
                .then((result) => {
                  let jsonBlockstack1 = result.data[0].decodedToken.payload.claim;
                  let projectsObject = JSON.stringify({
                    nombreCompleto: jsonBlockstack1.name,
                    firstName: jsonBlockstack1.firstname,
                    lastName: jsonBlockstack1.lastname,
                    aboutMe: jsonBlockstack1.description,
                    myFacebook: jsonBlockstack1.sameAs[0],
                    myTwitter: jsonBlockstack1.sameAs[1],
                    myYoutube: jsonBlockstack1.sameAs[2],
                    myInstagram: jsonBlockstack1.sameAs[3],
                    myLinkedin: jsonBlockstack1.sameAs[4],
                    myPinterest: jsonBlockstack1.sameAs[5],
                    myWebsite: jsonBlockstack1.sameAs[6],
                    email: jsonBlockstack1.email,
                    phoneNumber: jsonBlockstack1.telephone,
                    phoneCountry: jsonBlockstack1.telephoneCountry,
                    phonePrefix: jsonBlockstack1.telephonePrefix,
                  });
                  if (cipherX === true){
                      const data: string = projectsObject;
                      let iv: Buffer;
                      if (signatureX.length < 16) {
                        iv = Buffer.alloc(16, signatureX);  // Rellena con ceros si es menor a 16 bytes
                      } else {
                        iv = Buffer.from(signatureX.slice(0, 16), 'utf-8');  // Tomar solo los primeros 16 bytes
                      }
                      const password: string = publickeyX;
                      const key: Buffer = crypto.createHash('sha256').update(password).digest();
                      const cipher: crypto.Cipher = crypto.createCipheriv('aes-256-ctr', key, iv);
                      let encrypted: string = cipher.update(data, 'utf-8', 'base64');
                      encrypted += cipher.final('base64');
                      projectsObject = encrypted;
                  }
                  respuesta = JSON.stringify({success: 200, message: "Success Read Profile", code: 1, encrypt: cipherX, data: projectsObject});
                })
                .catch((error) => {
                  respuesta = JSON.stringify({ success: 404, message: 'Failure read Profile', code: 3, encrypt: cipherX, data: error.message });
                });
            }
          } else {
            respuesta = JSON.stringify({ success: 400, message: 'Failure Api-Key', code: 4, encrypt: cipherX, data: authorization });
          }
      } else {
        respuesta = JSON.stringify({ success: 400, message: 'Failure Key Authorization', code: 5, encrypt: cipherX, data: authorization });
      }
    } catch (error) {
      respuesta = JSON.stringify({ success: 404, message: 'Failure Read Key', code: 6, encrypt: cipherX, data: error.message });
    }

    return respuesta;
  }

  parseZoneFile(zonefile: string) {
    // Tu lógica para parsear el zonefile.
    return JSON.parse(zonefile);
  }
}
