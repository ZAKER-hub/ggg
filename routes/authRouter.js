const express = require("express")
const authController = require('../controlers/authControler')
const router = express.Router()
const {check} = require('express-validator')

router.post('/registration', [
    check('name', "name is empty").notEmpty(),
    check('surname', "surname is empty").notEmpty(),
    check('sex', "sex is empty").notEmpty(),
    check('phone', "phone is empty").notEmpty(),
    check('email', "Email is empty").notEmpty(),
    check('password', "Email is empty").isLength({min: 8, max:20}),
], authController.registration)
router.post('/login', authController.login)
router.get('/data', authController.getdata)

module.exports = router