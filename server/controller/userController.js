import jwt from 'jsonwebtoken';
import express from 'express';

import { loginUser, createUser, fetchAllUsers } from '../service/userService.js';


const app = express()
let refreshTokens = []

function getAllUsers (req, res) {
    fetchAllUsers().then(data => res.json(data));
}

function register(req, res) {
    const { username, password } = req.body;

    createUser(username, password).then(data => res.json(data))
}

function login(req, res) {
    const { username, password } = req.body;
    const user = { name: username }

    const accessToken = generateAccessToken(user)
    const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET)

    refreshTokens.push(refreshToken)

    loginUser(username, password).then(data => {
        console.log("data: ", {data, accessToken})
        res.json({data, accessToken})
        // res.json({data})
    })
    // res.json({accessToken: accessToken, refreshToken: refreshToken})
}

function logout(req, res) {
    refreshTokens = refreshTokens.filter(token => token !== req.body.token)
    if (!req.params.id) {
        return res.json({ msg: "User id is required " });
    }
    return res.status(200).send();
}

function deleteUser(req, res) {

}

function generateAccessToken(user) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '5h'})
}

export default { getAllUsers, register, login, logout, deleteUser }