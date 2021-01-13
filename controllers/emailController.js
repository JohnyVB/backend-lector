const nodemailer = require('nodemailer');

const controller = {

    sendEmailUser: (req, res) => {
        const email = req.params.email;
        const params = req.body;

        const transpoter = nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            secure: false,
            auth: {
                user: 'davon88@ethereal.email',
                pass: '3msJybSqqa8FHZRwtc'
            }
        });

        const mailOptions = {
            from: 'ReaderBook',
            to: email,
            subject: 'Han comentado el libro: ' + params.articletitle,
            html: `<div style="background-color: antiquewhite;">
                        <h4>Notificaciones</h4>
                            <div style="background-color: white;">
                                <p>
                                    <strong>
                                        <a href="#">
                                            `+ params.username + `
                                        </a>
                                    </strong>
                                        `+ params.message + `
                                    <strong>
                                        <a href="#">
                                            `+ params.articletitle + `
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
                    </div>`
        }

        if (params.chapter) {
            mailOptions.subject = 'Han comentado el capitulo: ' + params.articletitle;
        }

        transpoter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return res.status(500).send({
                    status: 'error',
                    message: 'Error al enviar el email al usuario'
                });
            }

            return res.status(200).send({
                status: 'success',
                info
            });
        });
    }
}

module.exports = controller;