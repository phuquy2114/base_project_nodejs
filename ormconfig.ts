import { CustomNamingStrategy } from "./src/bo/CustomNamingStrategy";
import * as dotenv from 'dotenv';

dotenv.config();

export default {
    type: process.env.DB_TYPE,
    charset:"utf8mb4",
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    logging: false,
    synchronize: true,
    extra: {
        "charset": "utf8mb4_unicode_ci"
        },
    entities: ["src/bo/entities/*.{ts,js}"],
    migrations: ["src/migrations/*.{ts,js}"],
    cli: {
        migrationsDir: "src/migrations",
        entitiesDir: "src/bo/entities"
    },
    subscribers: [
        "src/subscriber/**/*.ts"
     ],
    namingStrategy: new CustomNamingStrategy()
};
