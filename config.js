
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
    PASSEMAIL: process.env.PASSEMAIL || "Dragter23joh88."
}