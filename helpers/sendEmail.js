const nodemailer = require('nodemailer');


const sendEmail = async (email = '', name = '', title = '', modelo = '') => {

    return new Promise((resolve, reject) => {

        const transpoter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSEMAIL
            }
        });

        const mailOptions = {
            from: 'ReaderBook',
            to: email,
            subject: 'Nuevo comentario',
            html: `
                <head>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta2/dist/css/bootstrap.min.css" rel="stylesheet"
        integrity="sha384-BmbxuPwQa2lc/FVzBcNJ7UAyJxM6wuqIj61tLrc4wSX0szH/Ev+nYRRuWlolflfl" crossorigin="anonymous">
</head>

<body>
    <div class="bg-light">
        <h4>Notificaciones</h4>
        <div class="bg-white">
            <p>
                <strong>
                    <a href="#">
                        `+ name + `
                    </a>
                </strong>
                `+ title + `
                <strong>
                    <a href="#">
                        `+ modelo + `
                    </a>
                </strong>
            </p>

            <p>
                <i ngClass="fas fa-bullhorn mr-2"></i>
                `+ Date.now() + `
            </p>

            <span>
                <strong>
                    Nuevo
                </strong>
            </span>

        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta2/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-b5kHyXgcpbZJO/tY9Ul7kGkf1S0CWuKcCD38l8YkeH8z8QjE0GmW1gYU5S9FOnJ0" crossorigin="anonymous">
    </script>
</body>
            `
        }

        transpoter.sendMail(mailOptions, (error, info) => {
            if (error) {
                reject('No se pudo enviar el correo de la notificación');
            } else {
                resolve(info);
            }
        });
    });

}


module.exports = {
    sendEmail
}