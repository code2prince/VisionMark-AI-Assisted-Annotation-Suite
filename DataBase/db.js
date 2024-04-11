import sql from "mssql";

const sqlConfig = {
    user: "sa",
    password: "Prince@123",
    server: "Prince365",
    database: "Assignment",
    options: {
        trustServerCertificate: true
        // encrypt: true,
        // enableArithAbort: true // Recommended setting for mssql package
    },
    pool:{
        max: 10000,
        min: 0,
        idleTimeoutMillis:30000,
    },
};


async function dbConnect() {
    try {
        let pool = await sql.connect(sqlConfig);
        //console.log('pool',pool);
        console.log("Database Connected");
        return pool;
    } catch (err) {
        console.log('error dbs:', err);
    }
}

export default dbConnect;
