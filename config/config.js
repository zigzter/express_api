const env = process.env.NODE_ENV || 'development';

if (env === 'test' || env === 'development') {
    require('dotenv').config();
}
