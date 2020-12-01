/*
 * @Author: your name
 * @Date: 2020-11-26 15:59:45
 * @LastEditTime: 2020-11-30 20:30:29
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \9hospitalBackend\modules\database\poolconnect.js
 */
const mysql = require('mysql');

// interface MysqlConfigIProps = {
//     host: string,
//     user: string,
//     password: string,
//     database: string,
//     port: number
// }

const mysqlconfig = {
    host: '202.120.37.220',
    user: 'root',
    password: 'iwin204',
    database: '9hospital',
    port: 8686
};

class Mysql {
    constructor(config = mysqlconfig) {
        this.config = config;
        this.pool = mysql.createPool({
            ...mysqlconfig,
            connectionLimit: 10,
            queueLimit: 10
        });
    };

    query(command, args) {
        return new Promise((resolve, reject) => {
            this.pool.getConnection(function (err, connection) {
                if (err) {
                    reject(err);
                    connection.release();
                } else {
                    connection.query(command, args, function (err, result) {
                        if (err) {
                            reject(err);
                            connection.release();
                        } else {
                            resolve(result);
                            connection.release();
                        }
                    })
                }
            })
        })
    }
}


module.exports = Mysql;