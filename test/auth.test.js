const request = require('supertest');
const sinon = require('sinon');
let Signup = require("../models/signup").Signup;
let Login = require("../models/login").Login;
const { expect } = require('chai');
const referee = require("@sinonjs/referee");
const app = require("../server");
const jwt = require('jsonwebtoken');
const assert = referee.assert;

jest.mock('jsonwebtoken');


describe('POST /login', () => {
    let sandbox = sinon.createSandbox();
    let checkLoginStub, getUserDataStub;
    beforeEach(() => {
        checkLoginStub = sandbox.stub(Login.prototype, "checkLogin");
        getUserDataStub = sandbox.stub(Login.prototype, "getUserData")
    });
    afterEach(() => {
        sandbox.restore();
    });

    test('should respond with status 200', async () => {
        checkLoginStub.resolves(true);
        getUserDataStub.resolves([{
            nickname: "fake nickname",
            userId: 3
        }])
        const token = 'test_token';
        const jwtSignStub = sandbox.stub(jwt, 'sign').returns(token);
        const cookieStub = sandbox.stub();
        const res = { cookie: cookieStub };
        const response = await request(app)
            .post("/login")
            .send({
                email: "abc",
                password: "123456"
            })
            .expect(200);
        expect(response.body.message).to.deep.equal("登入成功");
        expect(response.body.status).to.deep.equal("success");
    });

    test("should not login with empty password or empty email", async () => {
        const response = await request(app)
            .post("/login")
            .send({
                email: "",
                password: ""
            })
            .expect(400);
        expect(response.body.message).to.deep.equal("不可為空");
        expect(response.body.status).to.deep.equal("error");
    })

    test("should not login with wrong password or email", async () => {
        checkLoginStub.resolves(false);
        const response = await request(app)
            .post("/login")
            .send({
                email: "aaaa",
                password: "111"
            })
            .expect(400);
        expect(response.body.message).to.deep.equal("無此用戶");
        expect(response.body.status).to.deep.equal("error");
    })

    test("responds with status 500 and error message when an error occurs", async () => {
        checkLoginStub.rejects(new Error('fake error'));
        const response = await request(app)
            .post("/login")
            .send({
                email: "aaaa",
                password: "111"
            })
            .expect(500);
        expect(response.body.message).to.deep.equal("內部伺服器出現錯誤");
        expect(response.body.status).to.deep.equal("error");
    })
})