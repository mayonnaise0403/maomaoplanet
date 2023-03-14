




// 引入所需的套件與模組
const request = require('supertest');
const express = require('express');
const updateRouter = require("./api/update_api");
const sinon = require('sinon');
let Login = require("./models/login").Login;
let Update = require("./models/update_data").Update;
const { expect } = require('chai');

Login = new Login();
Update = new Update();

// 建立 Express app 並建立一個簡單的路由
const app = express();

app.use(updateRouter);






// 定義測試案例
// describe('GET /hello', () => {
//     it('should respond with status 200 and message "Hello, World!"', async () => {
//         // 發送 HTTP request 到 API endpoint
//         const response = await request(app).get('/hello');

//         // 驗證回應的 HTTP status code 是否符合預期
//         expect(response.status).toBe(200);

//         // 驗證回應的內容是否符合預期
//         expect(response.body).toEqual({ message: 'Hello, World!' });
//     });
// });


// describe('GET /test', () => {
//     it('should respond with status 200 and message "it works"', async () => {
//         const response = await request(app).get('/test');
//         expect(response.status).toBe(200);
//         expect(response.body).toEqual({ status: 'success', message: 'it works' });
//     });
// });


describe('PUT /group_name', () => {
    it('should return 200 status code and new group name when update group name successfully', async () => {
        const groupId = 'test-group-id';
        const groupName = 'test-group-name';
        const updateGroupNameStub = sinon.stub(Update, 'updateGroupName').withArgs(groupId, groupName).resolves(true);

        const res = await request(app)
            .put('/group_name')
            .send({ groupId, groupName });

        sinon.assert.calledOnce(updateGroupNameStub);
        sinon.assert.calledWith(updateGroupNameStub, groupId, groupName);
        expect(res.status).to.equal(200);
        expect(res.body.status).to.equal('success');
        expect(res.body.newGroupName).to.equal(groupName);

        updateGroupNameStub.restore();
    });

    // it('should respond with status 500 if update fails', async () => {
    //     const updateGroupNameStub = sinon.stub(Update, 'updateGroupName').resolves(false);

    //     const response = await request(app)
    //         .put('/group_name')
    //         .send({ groupId: 'test-group-id', groupName: 'New Group Name' });

    //     expect(response.status).toEqual(500);
    //     expect(response.body.status).toEqual('error');

    //     updateGroupNameStub.restore();
    // });

    // it('should respond with status 500 if an error occurs', async () => {
    //     const updateGroupNameStub = sinon.stub(Update, 'updateGroupName').rejects(new Error('test error'));

    //     const response = await request(app)
    //         .put('/group_name')
    //         .send({ groupId: 'test-group-id', groupName: 'New Group Name' });

    //     expect(response.status).toEqual(500);
    //     expect(response.body.status).toEqual('error');
    //     expect(response.body.message).toEqual('伺服器內部發生錯誤');

    //     updateGroupNameStub.restore();
    // });
});

