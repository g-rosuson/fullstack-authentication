import dotenv from 'dotenv';
dotenv.config();

// Determine configuration based on if the application
// is in "production" or "development"
const isDeveloping = process.env.NODE_ENV === 'development';
const clientUrl = isDeveloping ? process.env.DEV_CLIENT_URL! : process.env.PROD_CLIENT_URL!;
const domain = isDeveloping ? process.env.DEV_DOMAIN! : process.env.PROD_DOMAIN!;

const config = {
    isDeveloping,
    clientUrl,
    domain,

    accessTokenSecret: process.env.ACCESS_TOKEN_SECRET!,
    refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET!,

    mongoURI: process.env.MONGO_URI!,
    mongoDBName: process.env.MONGODB_DB!,

    basePath: process.env.BASE_ROUTE_PATH!,
};

export default config;
