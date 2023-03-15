const request = require('supertest');
const sinon = require('sinon');
let Update = require("../models/update_data").Update;
const { expect } = require('chai');
const referee = require("@sinonjs/referee");
const app = require("../server");
const assert = referee.assert;


describe('PUT /group_name', () => {
    jest.setTimeout(10000)
    let sandbox = sinon.createSandbox();
    let updateGroupNameStub;
    beforeEach(() => {
        updateGroupNameStub = sandbox.stub(Update.prototype, 'updateGroupName');
    });
    afterEach(() => {
        sandbox.restore();
    });
    test('should respond with status 200', async () => {
        updateGroupNameStub.returns(true);
        const response = await request(app)
            .put("/group_name")
            .set('Content-Type', 'application/json')
            .send({
                groupId: "abc",
                groupName: "name",
            })
            .expect(200);
    });

    test('responds with status 500 when update fails', async () => {
        updateGroupNameStub.returns(false);
        const response = await request(app)
            .put('/group_name')
            .set('Content-Type', 'application/json')
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
            .set('Content-Type', 'application/json')
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





// describe('POST /new_group_user', () => {
//     let sandbox = sinon.createSandbox();
//     const groupId = "abc";
//     const userId = "name";
//     let updateGroupMemberStub;
//     let isSuccess;

//     test("should respond with status 200 and new group name if update success", async () => {
//         sandbox.stub(Update, "updateGroupMember").resolves(1)
//         const response = await request(app)
//             .post("/new_group_user")
//             .send({
//                 groupId: groupId,
//                 userId: userId
//             })


//         expect(response.status).to.equal(200);

//     })
// });




