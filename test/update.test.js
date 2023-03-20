const request = require('supertest');
const sinon = require('sinon');
const Update = require("../models/update_data").Update;
const Search = require("../models/search").Search;
const { expect } = require('chai');
const referee = require("@sinonjs/referee");
const app = require("../server");
const jwt = require('jsonwebtoken');


const assert = referee.assert;
jest.mock('jsonwebtoken');


describe("POST /group", () => {
    let sandbox = sinon.createSandbox();
    let createGroupStub;
    let createGroupDataStub;
    let getGroupMemberDataStub;
    beforeEach(() => {
        createGroupStub = sandbox.stub(Update.prototype, 'createGroup');
        createGroupDataStub = sandbox.stub(Update.prototype, 'createGroupData');
        getGroupMemberDataStub = sandbox.stub(Search.prototype, "getGroupMemberData")
    });
    afterEach(() => {
        sandbox.restore();
    });

    test('should respond with status 200', async () => {
        createGroupStub.resolves(true);
        createGroupDataStub.resolves(true);
        getGroupMemberDataStub.resolves(true);
        const response = await request(app)
            .post("/group")
            .send({
                groupName: "abc",
                groupMemberIdArr: [1, 2, 3]
            })
            .expect(200);
    })

    test("responds with status 500 and error message when an error occurs", async () => {
        createGroupStub.rejects(new Error('fake error'));
        createGroupDataStub.rejects(new Error('fake error'));
        getGroupMemberDataStub.rejects(new Error('fake error'));
        const response = await request(app)
            .post("/group")
            .send({
                groupName: "abc",
                groupMemberIdArr: [1, 2, 3]
            })
            .expect(500);
        expect(response.body).to.deep.equal({
            status: 'error',
            message: '伺服器內部發生錯誤',
        });
    })
})

describe('PUT /group_name', () => {
    let sandbox = sinon.createSandbox();
    let updateGroupNameStub;
    beforeEach(() => {
        updateGroupNameStub = sandbox.stub(Update.prototype, 'updateGroupName');
    });
    afterEach(() => {
        sandbox.restore();
    });
    test('should respond with status 200', async () => {
        updateGroupNameStub.resolves(true);
        const response = await request(app)
            .put("/group_name")
            .send({
                groupId: "abc",
                groupName: "name",
            })
            .expect(200);
    });

    test('responds with status 500 when update fails', async () => {
        updateGroupNameStub.resolves(false);
        const response = await request(app)
            .put('/group_name')
            .send({
                groupId: 'abc',
                groupName: 'name',
            })
            .expect(500);
    });

    test('responds with status 500 and error message when an error occurs', async () => {
        updateGroupNameStub.rejects(new Error('fake error'));

        const response = await request(app)
            .put('/group_name')
            .send({
                groupId: 'abc',
                groupName: 'name',
            })
            .expect(500);

        expect(response.body).to.deep.equal({
            status: 'error',
            message: '伺服器內部發生錯誤',
        });
    });
})


describe("POST /new_group_user", () => {
    let sandbox = sinon.createSandbox();
    let updateGroupMemberStub;
    beforeEach(() => {
        updateGroupMemberStub = sandbox.stub(Update.prototype, 'updateGroupMember');
    });
    afterEach(() => {
        sandbox.restore();
    });
    test('should respond with status 200', async () => {
        updateGroupMemberStub.resolves(true);
        const response = await request(app)
            .post("/new_group_user")
            .send({
                groupId: "abc",
                userId: "123",
            })
            .expect(200);
    })

    test('responds with status 500 and error message when an error occurs', async () => {
        updateGroupMemberStub.rejects(new Error('fake error'));

        const response = await request(app)
            .post('/new_group_user')
            .send({
                groupId: "abc",
                userId: "123",
            })
            .expect(500);

        expect(response.body).to.deep.equal({
            status: 'error',
            message: '伺服器內部發生錯誤',
        });

    });
})

describe("PUT /leave_group", () => {
    let sandbox = sinon.createSandbox();
    let leaveGroupStub, fakeReq;
    beforeEach(() => {
        leaveGroupStub = sandbox.stub(Update.prototype, 'leaveGroup');
        fakeReq = {
            signedCookies: {
                access_token: 'fake_access_token'
            },
            body: {
                groupId: 'abc'
            }
        };
    });
    afterEach(() => {
        sandbox.restore();
    });
    test('should respond with status 200', async () => {
        jwt.decode.mockReturnValue({ userId: '123' });
        leaveGroupStub.resolves(true);
        const response = await request(app)
            .put("/leave_group")
            .send(fakeReq)
            .expect(200);
    })

    test('responds with status 500 when update fails', async () => {
        leaveGroupStub.resolves(false);
        const response = await request(app)
            .put("/leave_group")
            .send(fakeReq)
            .expect(500);
    })

    test('responds with status 500 and error message when an error occurs', async () => {
        leaveGroupStub.rejects(new Error('fake error'));
        const response = await request(app)
            .put("/leave_group")
            .send(fakeReq)
            .expect(500);

        expect(response.body).to.deep.equal({
            status: 'error',
            message: '伺服器內部發生錯誤',
        });

    });
})






