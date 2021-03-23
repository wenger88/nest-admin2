export function ormConfig(): any {
  return {
    type: process.env.DATABASE_TYPE,
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    synchronize: true,
    logging: false,
    autoLoadEntities: true,
    useUnifiedTopology: true,
    useNewUrlParser: true,
    // connectTimeout: parseInt(process.env.DATABASE_CONNECTION_TIME_OUT),
    // acquireTimeout: parseInt(process.env.DATABASE_ACQUIRE_TIME_OUT),
    // extra: {
    //   connectionLimit: parseInt(process.env.DATABASE_CONNECTION_LIMIT),
    // },
    entities: [__dirname + '/**/*.entity{.ts,.js}'],
  };
}
