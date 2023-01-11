const { describe, expect, test } = require('@jest/globals');
const app = require('../app');
const request = require('supertest');
const mongoose = require('mongoose');
require('dotenv').config()

mongoose.Promise = global.Promise;
mongoose.set('strictQuery', false);


describe('login', () => {
    beforeAll(async () => {
        app.listen(3000, () => {
            console.log("Server started");
        })
        try {
            await mongoose.connect(process.env.DB_CONNECTION_DATA);
            console.log("Database connection successful");
        }
        catch (err) {
            console.log("Connection error");
            console.log(err);
        }
    })
    afterAll(async () => {
        await mongoose.disconnect();
    })

    test('login test', async () => {
        const response = await request(app).post("/users/login").send({
            email: "maximandersen@gmail.com",
            password: "12345"
        });
        const {token, user} = response.body.result;
        expect(response.status).toBe(200);
        expect(typeof token).toBe("string");
        expect(typeof user.email).toBe("string");
        expect(typeof user.subscription).toBe("string");
    })
})
