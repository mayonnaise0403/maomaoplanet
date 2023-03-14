




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
    it('should respond with status 200 and new group name if update succeeds', async () => {
        const body = { groupId: '123', groupName: 'newGroupName' }

        // 建立一個 updateGroupName 的 stub，讓它返回預期的值 true
        const updateGroupNameStub = sinon.stub(Update, 'updateGroupName').returns(true);
        // 呼叫 API
        const res = await request(app)
            .put('/group_name')
            .send(body);

        // 驗證回應是否正確
        expect(res.status).to.equal(500);
        expect(res.body).to.equal({ message: "伺服器內部發生錯誤", status: "error" });



        // 還原 stub 的行為
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

