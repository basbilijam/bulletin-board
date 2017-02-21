const express = require('express'),
      router = express.Router();
      sequelize = require('sequelize')
/*
// var noticesRouter = require('printNotices')

var app = express(),
		sequelize = new Sequelize('bulletinboarddb', process.env.POSTGRES_USER, process.env.POSTGRES_PASSWORD, {
			dialect: 'postgres'
		});

var notice = sequelize.define('notice', {
	title: Sequelize.STRING,
	body: Sequelize.TEXT
});

module.exports = router;
