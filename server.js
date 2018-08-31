const express = require('express');
const path = require('path');
const nunjucks = require('nunjucks');
const bodyParser = require('body-parser');
const http = require('http');
const session = require('express-session');
const connect = require('./server/db/connect');

let env = process.env.NODE_ENV;
env = env == null ? 'prd' : env;


// 连接数据库
connect();

const port = 3000;
process.rootPath = __dirname;
process.port = port;

const host = {
  dev: 'http://localhost:3000',
  prd: 'http://www.facemagic888.com',
};

process.host = host[env];


const app = express();

// view engine setup
app.set('view engine', 'html');
app.engine('html', nunjucks.render);
// 管理视图文件，设置之后， HTML有修改，刷新才能有效果
nunjucks.configure(path.join(__dirname, 'server/views'), {
  autoescape: true,
  express: app,
  watch: true,
});

app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: 'recommand 128 bytes random string',
}));

// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'output')));


require('./server/routers/index.js')(app);


// 创建应用服务器
const server = http.createServer(app);

server.listen(port, '0.0.0.0', (err) => {
  if (err) {
    console.log(err);
  }
  console.log('启动成功');
});
