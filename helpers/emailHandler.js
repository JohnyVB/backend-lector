const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: process.env.HOST,
    port: process.env.PORT_HOST,
    secure: false,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSSMTP
    }
});

const sendEmailNotification = async (email = '', name = '', title = '', model = '') => {

    transporter.verify((error) => {
        if (error) {
            throw new Error('la conexión al servidor SMTP fallo', error)
        }else{
            console.log('Conexión al servidor SMTP exitosa');
        }
    });

    await transporter.sendMail({
        from: `ReaderBook <${process.env.EMAIL}>`,
        to: email,
        subject: 'NOTIFICACIÓN: Nuevo comentario',
        html: `<strong><a href="#">`+ name + `</a></strong>`+ title + `<strong><a href="#">`+ model + `</a></strong>`
    });
}

const sendEmailActivation = async (email = '', validatorNumber = '') => {
    transporter.verify((error) => {
        if (error) {
            throw new Error(email+':' + ' La conexión al servidor SMTP fallo', error)
        }else{
            console.log(email+':' + 'Conexión al servidor SMTP exitosa');
        }
    });

    await transporter.sendMail({
        from: `ReaderBook <${process.env.EMAIL}>`,
        to: email,
        subject: 'NOTIFICACIÓN: Regisro en ReaderBook',
        html: `<p>Se ha enviado este correo para activar su cuenta en ReaderBook: </p> 
               <p>Ingrese en la App este numero de verificación: <strong>${validatorNumber}</strong> </p>
               <p><strong>Si no realizo el registro por favor omitir este correo.</strong></p>   
            `
    });
}


module.exports = {
    sendEmailNotification,
    sendEmailActivation
}