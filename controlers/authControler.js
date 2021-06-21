const Users = require('../models/Users')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {validationResult} = require('express-validator')
const {secret} = require('../config')

const generateJWT = (id, email, name, surname, sex) => {
    const payload = {
        id,
        email,
        name,
        surname,
        sex
    }
    return jwt.sign(payload, secret, {expiresIn: "192h"})
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
                res.status(400).json({message: "Email registrate"})
            }
            let hashPass = bcrypt.hashSync(password, 6)
            const user = new Users({name: name, surname: surname, sex: sex, phone: phone, email: email, password: hashPass})
            await user.save()
            return res.status(200).json({message: "User added"})
        }
        catch(e){
            console.log(e)
            res.status(400).json({message: "Reg error"})
        }
    }
    async login(req, res){
        try{
            console.log(req.body)
            const {email, password} = req.body
            const candidate = await Users.findOne({email})
            console.log(candidate)
            if(!candidate){
                return res.status(400).json({message: "User not found"})
            }
            const validPassword = bcrypt.compareSync(password, candidate.password)
            if(!validPassword){
                return res.status(400).json({message: "Password Failed"})
            }
            
            const token = generateJWT(candidate._id, candidate.email, candidate.name,candidate.surname, candidate.sex)
            return res.status(200).json({token})
        }
        catch(e){
            console.log(e)
            res.status(400).json({message: "Log error"})
        }
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