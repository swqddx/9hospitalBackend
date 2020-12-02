/*
 * @Author: your name
 * @Date: 2020-11-26 13:47:26
 * @LastEditTime: 2020-12-02 10:40:11
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \9hospitalBackend\app.js
 */

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

// 路由文件配置
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var patientsRouter = require('./routes/patients');
var iotRouter = require('./routes/iot');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// 输出静态文件
app.use('/files', express.static(path.join(__dirname, 'public/files')));

// 设置跨域
var allowCrossDomain = function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*'); // 设置允许访问的域名
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'x-requested-with, Content-Type');
    res.header('Access-Control-Allow-Credentials', 'true');
    if (req.method === 'OPTIONS') {
        res.send("success");
    } else {
        next();
    }
};
app.use(allowCrossDomain);

app.use(logger('dev'));
// 设置解析post body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// 设置路由头路径
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/patients', patientsRouter)
app.use('/iot', iotRouter)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;