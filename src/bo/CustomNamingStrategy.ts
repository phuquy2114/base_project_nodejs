import { DefaultNamingStrategy, NamingStrategyInterface, Table } from 'typeorm';

export class CustomNamingStrategy extends DefaultNamingStrategy implements NamingStrategyInterface {
  uniqueConstraintName(tableOrName: Table | string, columnNames: string[]): string {
    tableOrName = typeof tableOrName === 'string' ? tableOrName : tableOrName.name;
    const name = columnNames.reduce((name, column) => `${name}_${column}`, `${tableOrName}`);
    return `UNQ_${name}`;
  }

  // eslint-disable-next-line
  relationConstraintName(tableOrName: Table | string, columnNames: string[], where?: string): string {
    tableOrName = typeof tableOrName === 'string' ? tableOrName : tableOrName.name;
    const name = columnNames.reduce((name, column) => `${name}_${column}`, `${tableOrName}`);
    return `REL_${name}`;
  }

  defaultConstraintName(tableOrName: Table | string, columnName: string): string {
    tableOrName = typeof tableOrName === 'string' ? tableOrName : tableOrName.name;
    const name = `${tableOrName}_${columnName}`;
    return `FK_${name}`;
  }

  // eslint-disable-next-line
  foreignKeyName(tableOrName: Table | string, columnNames: string[], referencedTablePath?: string, referencedColumnNames?: string[]): string {
    tableOrName = typeof tableOrName === 'string' ? tableOrName : tableOrName.name;
    const name = columnNames.reduce((name, column) => `${name}_${column}`, `${tableOrName}_${referencedTablePath}`);
    return `FK_${name}`;
  }

  // eslint-disable-next-line
  indexName(tableOrName: Table | string, columns: string[], where?: string): string {
    tableOrName = typeof tableOrName === 'string' ? tableOrName : tableOrName.name;
    const name = columns.reduce((name, column) => `${name}_${column}`, `${tableOrName}`);
    return `IDX_${name}`;
  }
}
