import {read} from '../utils/model.js'
import { InternalServerError, AuthrizationError } from "../utils/errors.js"
import sha256 from 'sha256'
import jwt from '../utils/jwt.js'

const LOGIN = (req, res, next) => {
    try {

        let {username, password} = req.body
        let users = read('users')

        let user = users.find(user => user.username == username && user.password == sha256(password))

        if(!user){
            return next( new AuthrizationError(401, 'wrong username or password') )
        }

        delete user.password

        res.status(200).json({
            status: 200,
            message: 'success',
            token: jwt.sign({userId: user.userId}),
            data: user  
        })

    } catch (error) {
        return next( new InternalServerError(500, error.message) )
    }
}

export default {
    LOGIN
}