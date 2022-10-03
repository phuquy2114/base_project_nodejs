import { Roles } from '../consts/Roles';

export class JwtInfo {
  uuid: number = null;
  usr: string = null;
  role: Roles = null;

  public toString = (): string => {
    return `${this.uuid}.${this.usr}.${this.role}`;
  };
}
