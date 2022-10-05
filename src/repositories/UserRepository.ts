import { EntityRepository, Repository, UpdateResult } from 'typeorm';
import { User } from '../entities/User';
import { Roles } from '../consts/Roles';
import { Service } from 'typedi';
import { Geometry, Point } from 'geojson';

@Service()
@EntityRepository(User)
export class UserRepository extends Repository<User> {
  getCustomerUsers(): Promise<User[]> {
    return this.createQueryBuilder('q')
      .leftJoinAndSelect("q.location", "location")
      .where('role = :role', { role: Roles.CORPORATE })
      .getMany();
  }

  getServiceUser(): Promise<User[]> {
    return this.createQueryBuilder('q')
      .leftJoinAndSelect("q.location", "location")
      .where('role = :role', { role: Roles.CUSTOMER })
      .getMany();
  }

  getByUsername(usr: string): Promise<User> {
    return this.createQueryBuilder('q')
      .leftJoinAndSelect("q.location", "location")
      .where('usr = :usr', { usr: usr }).getOne();
  }

  updateNewPassword(usr: string, pwd: string): Promise<UpdateResult> {
    return this.createQueryBuilder()
      .update(User)
      .set({
        pwd: "pwd",
      })
      .where('usr = :usr', { usr: usr }).execute();
  }

  getRangeServices(lat: number, long: number, range: number = 1000): Promise<User[]> {
    return this.createQueryBuilder('l')
      .leftJoinAndSelect("l.location", "location")
      .select(['ST_Distance(location, ST_SetSRID(ST_GeomFromGeoJSON(:origin), ST_SRID(location)))/1000 AS distance' ])
      .where('ST_DWithin(location, ST_SetSRID(ST_GeomFromGeoJSON(:origin), ST_SRID(location)) ,:range)', { role: Roles.CUSTOMER })
      .orderBy("distance", "ASC")
      .setParameters({
        // stringify GeoJSON
        origin: JSON.stringify(origin),
        range: range * 1000 //KM conversion
      })
      .getMany();
  }
}
