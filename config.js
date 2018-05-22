module.exports = {
  publicPath: '/',
  server: {
    serverPort: '3002',
    clientPort: '3003'
  },
  demoRootPath: 'http://garvenzhang.github.io/',
  auth: {
    key: './server/auth/2_www.hellojm.cn.key',
    cert: './server/auth/1_www.hellojm.cn_bundle.crt',
    subToken01: '#$%^%Gdsc#%&e@',
    subToken02: 'd24g&&3ad##w',
    CMS_ACCESS_TOKEN: '*2J)js*k>1+*'
  },
  dbConfig: {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'sz1997',
    database: 'myblog'
  },
  corsHeader: {
    ACCESS_CONTROL_ALLOW_ORIGIN: '*',
    ACCESS_CONTROL_ALLOW_METHOD: 'GET, POST, OPTIONS',
    ACCESS_CONTROL_ALLOW_HEADERS: '*'
  }
}
