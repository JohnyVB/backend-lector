
module.exports = {
    TOKEN_SECRET: process.env.TOKEN_SECRET || "tokenultrasecreto",
    PORT: process.env.PORT || 3900,
    application: {
        cors: {
            server: [
                {
                    origin: "*", 
                    credentials: true
                }
            ]
        }
    },
    EMAIL: process.env.EMAIL || "readerbookappweb@gmail.com",
    PASSEMAIL: process.env.PASSEMAIL || "Dragter22joh54.",
    BDTEST: process.env.BDTEST || "mongodb://localhost:27017/api-rest-lector",
    BDPROD: process.env.BDPROD || "mongodb+srv://root:root3517@cluster0.p9hkj.mongodb.net/api-rest-lector?retryWrites=true&w=majority",
    BDPRODTEST: process.env.BDPRODTEST || "mongodb+srv://root:root3517@cluster0.p9hkj.mongodb.net/api-rest-lector-test?retryWrites=true&w=majority"
}