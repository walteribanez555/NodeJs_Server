const Sequelize = require("sequelize");
var dotenv = require('dotenv');
const { env } = require('process');


dotenv.config();


const Db = {
    

    connect () { 
    
        sequelize = new Sequelize(
            process.env.Db_database,
            'root',
            process.env.Db_password,
            {
            host: process.env.Db_host,
            dialect: process.env.Db_type
            }
        );
        
        sequelize.authenticate().then(() => {
            console.log('Connection has been established successfully.');
        }).catch((error) => {
            console.error('Unable to connect to the database: ', error);
        });

        return sequelize
    
    }

    

}




module.exports = Db