//Models
import ImgNotification from "../Models/imgNotification.model.js";

//Utils 
import catchAsync from "../Utils/catchAsync.util.js";
import appError from "../Utils/appError.js";
import { uploaImgNotification, deleteImgNotification, updateImgNotification, getNotificationImgUrl } from "../Utils/firebase.util.js";


export const createImgNotification = catchAsync(async (req, res, next) => {

    const { linkImg } = req.body;
    console.log('req.body', req.body)

    const notification = await ImgNotification.findAll();

    if (notification.length > 0) {
       return next(new appError('Ya existe una imagen cargada', 400));
    }

    const result = await uploaImgNotification(req.file);

    const imgNotification = await ImgNotification.create({
        urlImagen: result,
        linkImg
    })

    res.status(201).json({
        status: 'success',
        message: 'Imagen cargada con éxito',
    })
})

export const deleteImgNotifications = catchAsync(async (req, res, next) => {
    const { id } = req.params;

    const imgNotification = await ImgNotification.findOne({ where: { id } });

    if (!imgNotification) {
        return next(new appError('Imagen no encontrada', 404));
    }

    await deleteImgNotification(imgNotification.urlImagen);

    await ImgNotification.destroy({ where: { id } });

    res.status(200).json({
        status: 'success',
        message: 'Imagen eliminada con éxito',
    })
})

export const updateImgNotifications = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const imgNotification = await ImgNotification.findOne({ where: { id } });

    if (!imgNotification) {
        return next(new appError('Imagen no encontrada', 404));
    }

    const img = req.file;

    const result = await uploaImgNotification(img);

    await ImgNotification.update({ urlImagen: result });

    res.status(200).json({
        status: 'success',
        message: 'Imagen actualizada con éxito',
    })
})

export const getImgNotification = catchAsync(async (req, res, next) => {

    let imgNotification = await ImgNotification.findAll();


    if (imgNotification.length === 0) {
       return res.status(200).json({
            status: 'error',
            message: 'No existe una imagen cargada',
            data: imgNotification
        })
    }

    imgNotification = imgNotification[0];

    const notification = await getNotificationImgUrl(imgNotification);

    res.status(200).json({
        status: 'success',
        data: notification,
        message: 'Imagen cargada con éxito',
    })
})