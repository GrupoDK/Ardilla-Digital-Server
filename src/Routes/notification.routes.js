import { Router } from 'express';

//Utils
import upload from '../Utils/multer.util.js'


//Controllers
import {
    CreateNotification,
    getNotifications,
    deleteNotification
} from '../Controllers/notification.controller.js'

import { createImgNotification, getImgNotification, updateImgNotifications, deleteImgNotifications} from '../Controllers/imgNotification.controller.js'


//Middlewares
import { protectAdmin, protectSession } from '../Middlewares/auth.middleware.js'
import { notificationExists } from '../Middlewares/notification.middleware.js'


const notificationRouter = Router();

notificationRouter.use(protectSession);

notificationRouter.get('/', getNotifications);

notificationRouter.get('/img', getImgNotification)

notificationRouter.use(protectAdmin)

notificationRouter.post('/', CreateNotification);

notificationRouter.post('/uploadimg', upload.single('image'), createImgNotification);

notificationRouter.put('/img/:id', upload.single('imagen'), updateImgNotifications);

notificationRouter.delete('/:id', notificationExists, deleteNotification);

notificationRouter.delete('/img/:id', deleteImgNotifications);


export default notificationRouter