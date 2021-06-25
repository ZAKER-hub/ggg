const Users = require('../models/Users')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {validationResult} = require('express-validator')
const config = require('../config')
const mailer = require('../mailer')
const mongoose = require('mongoose')
const { sendEmail } = require('../mailer')

const generateJWT = (id, email, name, surname, sex) => {
    const payload = {
        id,
        email,
        name,
        surname,
        sex
    }
    return jwt.sign(payload, config.secret, {expiresIn: "300h"})
}



class authController {
    async registration(req, res){
        try{
            console.log(req.body)
            const errors = validationResult(req)
            if(!errors.isEmpty()){
                return res.status(400).json({message: errors})
            }
            const {email, password, name, surname, sex, phone} = req.body
            const candidate = await Users.findOne({email})
            if (candidate) {
                res.status(400).json({message: "Email"})
            }
            let hashPass = bcrypt.hashSync(password, 6)
            const user = new Users({name: name, surname: surname, sex: sex, phone: phone, email: email, password: hashPass})
            await user.save()
            const token = await jwt.sign({_id: user._id}, config.secret, {expiresIn: "48h"})
            sendEmail(email, "http://"+config.serverHost+"/auth/confirmationEmail?tok="+token, name)
            return res.status(200).json({message: "UserHasAdd"})
        }
        catch(e){
            console.log(e)
            res.status(400).json({message: "RegError"})
        }
    }
    async login(req, res){
        try{
            console.log(req.body)
            const {email, password} = req.body
            const candidate = await Users.findOne({email})
            console.log(candidate)
            if(!candidate){
                return res.status(400).json({message: "Неверное имя пользователя"})
            }
            const validPassword = bcrypt.compareSync(password, candidate.password)
            if(!validPassword){
                return res.status(400).json({message: "Неверный пароль"})
            }
            if(candidate.isVerified != true){
                return res.status(400).json({message: "Подтвердите почту"})
            }
            
            const token = generateJWT(candidate._id, candidate.email, candidate.name,candidate.surname, candidate.sex)
            return res.status(200).json({token})
        }
        catch(e){
            console.log(e)
            res.status(400).json({message: "Неизвестная ошибка входа"})
        }
    }
    async confirmationEmail(req, res){
        let token = req.query.tok
        let decodeData = await jwt.verify(token, config.secret)
        console.log(decodeData._id)
        Users.findByIdAndUpdate(decodeData._id, { isVerified: true },
        function (err, docs) {
        if (err){
            return res.status(400).json({message: "Не удалось потвердить почту ("})
        }
        else{
            return res.status(200).json({message: "Почта успешно подтверждена !"})
        }
});
        
    }
    async getdata(req, res){
        try{
            res.json("server worked")
        }
        catch(e){
            console.log(e)
        }
    }
}

module.exports = new authController()