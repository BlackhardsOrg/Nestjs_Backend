export default () => {
  //   console.log(process.env.DATABASE_PASSWORD);
  return {
    port: parseInt(process.env.PORT, 10) || 3000,
    database: {
      host: process.env.DATABASE_HOST,
      port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
      dbUser: process.env.DATABASE_USER,
      dbPass: process.env.DATABASE_PASSWORD,
      dbURI: `mongodb+srv://vyra:${process.env.DATABASE_PASSWORD}@blackhardsserver.qe2hbmy.mongodb.net/blackhards?retryWrites=true&w=majority`,
    },
    auth: {
      hashSecret: process.env.PASSWORD_SALT,
      jwtSecret: process.env.JWT_SECRET,
    },
  };
};
