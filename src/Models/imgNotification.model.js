import db  from '../Utils/database.util.js';
import { DataTypes } from "sequelize";

const ImgNotification = db.define('imgNotification', {
	id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true,
		allowNull: false,
	},
	urlImagen: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	linkImg: {
		type: DataTypes.STRING,
		allowNull: true,
	},
    status: {
		type: DataTypes.STRING,
		allowNull: false,
		defaultValue: 'active',
	},
});

export default ImgNotification;