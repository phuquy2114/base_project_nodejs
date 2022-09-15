import { Roles } from '../../consts/Roles';

export class JwtInfo {
  usr: string = null;
  role: Roles = null;

  public toString = (): string => {
    return `${this.usr}.${this.role}`;
  };
}
