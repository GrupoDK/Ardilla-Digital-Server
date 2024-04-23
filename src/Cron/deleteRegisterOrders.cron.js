import cron from 'node-cron';
import Orders from '../Models/order.model.js';
import dotenv from 'dotenv';
import { Op } from 'sequelize';
import { sendEmailCronDev } from '../Utils/nodemailer/nodemailer.js';
import Profile from '../Models/profile.model.js';
import Account from '../Models/account.model.js';

dotenv.config();

 export async function deleteRegisterOrders() {
     cron.schedule('0 0 1 * *', async () => {
        try {
            const threeMonthsAgo = new Date();
                  
            threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
        
            const deletedCount = await Orders.destroy({
                where: {
                    createdAt: {
                        [Op.lt]: threeMonthsAgo
                    }
                }
            })
            console.log(deletedCount)
            console.log('Registros eliminados:', deletedCount)

            const profilesPurchased = await Profile.findAll({
                where: {
                    status: 'purchased',
                    isCombo: false,
                    createdAt: {
                        [Op.lt]: threeMonthsAgo
                    }
                }
            })
            profilesPurchased.forEach(profile => {
                profile.destroy();
            })

            const accountsPurchased = await Account.findAll({
                where: {
                    status: 'purchased',
                    createdAt: {
                        [Op.lt]: threeMonthsAgo,
                        createdAt: {
                            [Op.lt]: threeMonthsAgo
                        }
                    }
                }
            })
            accountsPurchased.forEach(account => {
                account.destroy();
            })
        
           await sendEmailCronDev(
            {
            email: process.env.SMTP_DEV, 
            subject: 'Registros Dk Soluciones borrados con exito',
            }, 
            `Se han eliminado ${deletedCount} registros.
             Con fecha ${new Date()}
        
             Todo bien mi rey, echale ganas 😎
        `
            )
           } catch (error) {
             console.log('Error al eliminar los registros: ', error)
        
             await sendEmailCronDev(
                {
                email: process.env.SMTP_DEV,
                subject: 'Error al eliminar los registros',
                },
                `Error al eliminar los registros: ${error}`
             )
           }
     })
}
