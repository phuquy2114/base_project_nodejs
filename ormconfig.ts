import { CustomNamingStrategy } from "./src/bo/CustomNamingStrategy";
import * as dotenv from 'dotenv';

dotenv.config();

export default {
    type: process.env.DB_TYPE,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    logging: false,
    synchronize: true,
    entities: ["src/bo/entities/*.{ts,js}"],
    migrations: ["src/migrations/*.{ts,js}"],
    cli: {
        migrationsDir: "src/migrations",
        entitiesDir: "src/bo/entities"
    },
    namingStrategy: new CustomNamingStrategy()
};
