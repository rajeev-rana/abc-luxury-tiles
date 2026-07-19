module.exports = {
  apps: [
    {
      name: 'abc-tiles-backend',
      script: 'server.js',
      cwd: './backend',
      env: {
        NODE_ENV: 'production',
        PORT: 5001,
        MONGO_URI: 'mongodb://localhost:27017/abc_luxury_tiles',
        JWT_SECRET: 'abc_secret_key'
      }
    },
    {
      name: 'abc-tiles-frontend',
      script: 'node_modules/next/dist/bin/next',
      args: 'start',
      cwd: './frontend',
      env: {
        PORT: 3000,
        NODE_ENV: 'production',
        NEXT_PUBLIC_API_URL: 'http://localhost:5001'
      }
    }
  ]
};
