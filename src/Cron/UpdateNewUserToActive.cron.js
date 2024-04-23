import cron from 'node-cron';
import User from '../Models/user.model.js';
import AppError from '../Utils/appError.js';
import { sendEmailCronDev } from '../Utils/nodemailer/nodemailer.js';

export function updateNewUserToActive() {
    cron.schedule('0 0 1 * *', async () => {
        try {
            const users = await User.findAll({
                where: {
                    status: 'new'
                }
            })
            if(users.length === 0){
                return new AppError('No hay usuarios nuevos', 400)
            }
            users.forEach(user => {
                user.update({ status: 'active' })
            })
            await sendEmailCronDev({
                email: 'pedroalvear67@gmail.com',
                subject: 'Nuevos usuarios de la semana',
            }, `Esta semana han sido ${users.length} usuarios nuevos`)
        } catch (error) {
            console.log(error)
            await sendEmailCronDev({
                email: process.env.SMTP_DEV,
                subject: 'Error en UpdateNewUserToActive.cron',
            }, error)
        }
    })
}