import { expect } from 'chai';
import 'mocha';
import { AuthenReq } from '../src/bo/models/Authen/AuthenReq';
import { AuthenRes } from '../src/bo/models/Authen/AuthenRes';
import { UserRepository } from '../src/repositories';
import { AuthenService } from '../src/services/AuthenService';
import 'reflect-metadata';
import Container from 'typedi';
import { createConnection, useContainer } from 'typeorm';
import * as entities from '../src/bo/entities/index';
import * as many2manyEntities from '../src/bo/entities/many2many/index';
import * as ormconfig from '../ormconfig';
import { getCustomRepository } from 'typeorm';

describe('Authen', () => {
  let authenService: AuthenService;

  before((done) => {
    (async () => {
      // runs before all tests in this file regardless where this line is defined.
      process.env.JWT_SECRET = 'youraccesstokensecret';
      process.env.TOKEN_EXPIRE = '1d';

      // create connection
      useContainer(Container);

      // eslint-disable-next-line
        const arrEntities: any[] = [];
      for (const name in entities) {
        if (Object.prototype.hasOwnProperty.call(entities, name)) {
          // eslint-disable-next-line
                const entity:any = (entities as any)[name];
          arrEntities.push(entity);
        }
      }

      // many2manyEntities example
      for (const name in many2manyEntities) {
        if (Object.prototype.hasOwnProperty.call(many2manyEntities, name)) {
          // eslint-disable-next-line
                const entity:any = (many2manyEntities as any)[name];
          arrEntities.push(entity);
        }
      }

      // eslint-disable-next-line
        const configDB: any = {
        ...ormconfig.default,
        entities: arrEntities,
        migrations: [],
        cli: null
      };

      await createConnection(configDB).catch((ex) => {
        if (ex.name === 'AlreadyHasActiveConnectionError') {
          console.log('The connection is already open');
        } else {
          console.log(`** createDBConnection error:`, `config: ${JSON.stringify(configDB)} - name:${ex.name} - msg:${ex.message}`);
        }
      });

      // create servive
      const userRepository: UserRepository = getCustomRepository(UserRepository);
      authenService = new AuthenService(userRepository);
    })().then(() => {
      done();
    });
  });

  after(() => {
    // runs after all tests in this file
  });

  beforeEach(() => {
    // runs  each test in this block
  });

  afterEach(() => {
    // runs after each test in this block
  });

  // login success ============================================================================================
  it('login success', async () => {
    const request: AuthenReq = {
      usr: 'cus1',
      pwd: '123456'
    };
    const response: AuthenRes = await authenService.login(request);

    expect(response.usr).to.equal('cus1');
  });

  // login failed by password ============================================================================================
  it('login failed by password', async () => {
    try {
      const request: AuthenReq = {
        usr: 'cus1',
        pwd: '12345'
      };
      await authenService.login(request).catch((e) => {
        throw e;
      });
    } catch (e) {
      expect(e.errCd).to.equal('login_failed');
    }
  });

  // login failed by username ============================================================================================
  it('login failed by username', async () => {
    try {
      const request: AuthenReq = {
        usr: 'cus999',
        pwd: '123456'
      };
      await authenService.login(request).catch((e) => {
        throw e;
      });
    } catch (e) {
      expect(e.errCd).to.equal('login_failed');
    }
  });

  // login failed by empty login info ============================================================================================
  it('login failed by empty login info', async () => {
    try {
      const request: AuthenReq = {
        usr: '',
        pwd: ''
      };
      await authenService.login(request).catch((e) => {
        throw e;
      });
    } catch (e) {
      expect(e.errCd).to.equal('login_failed');
    }
  });
});
