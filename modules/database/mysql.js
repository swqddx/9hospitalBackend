/*
 * @Author: your name
 * @Date: 2020-11-26 15:59:45
 * @LastEditTime: 2020-11-30 18:09:08
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

const sqlCommand = {
    Add: "",
    Delete: "",
    Update: "",
    Select: "SELECT * FROM patient_list"
}

class Mysql {
    constructor(config = mysqlconfig) {
        this.config = config;
        this.connection = mysql.createConnection(this.config);
        this.connection.connect();
    };

    add() {
        this.connection.query();
        return
    };
    delete() {
        this.connection.query();
        return
    };
    update() {
        this.connection.query();
        return
    };
    select() {
        this.connection.query(sqlCommand.Select, function(err, result){
            console.log(result);
            return result;
        });

    };
}


module.exports = Mysql;