
/**
 * @swagger
 * /signout:
 *  delete:
 *      tags:
 *        - signup and login
 *      description: 登出
 *      responses:
 *          "200":
 *             description: 登出成功，從 Cookie 中移除 JWT 加密資訊
 *             headers:
 *               Set-Cookie:
 *                 description: 用來移除 Cookie 中的 JWT
 *                 schema:
 *                   type: string
 *             content:
 *               application/json:
 *                 schema:
 *                   type: object
 *                   properties:
 *                     status: 
 *                       type: string
 *                       example: success
 *                     message:
 *                       type: string
 *                       example: 登出成功
 *          "500":
 *             description: 伺服器內部錯誤
 *             content:
 *               application/json:
 *                 schema:
 *                   type: object
 *                   properties:
 *                     status:
 *                       type: string
 *                       example: "error"
 *                     message:
 *                       type: string
 *                       example: "內部伺服器出現錯誤"
 */


/**
 * @swagger
 * /signup:
 *  post:
 *      tags:
 *        - signup and login
 *      description: 確認使用者的資料
 *      requestBody:
 *        required: true
 *        description: 使用者的資料
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                nickname:
 *                  type: string
 *                  example: "毛毛"
 *                email:
 *                  type: string
 *                  example: "email@gmail.com"
 *                password:
 *                  type: string
 *                  example: '1234567'
 *      responses:
 *          "200":
 *             description: 成功確認使用者資料，可以繼續做後續的信箱驗證
 *             content:
 *               application/json:
 *                 schema:
 *                   type: object
 *                   properties:
 *                     status: 
 *                       type: string
 *                       example: success
 *                     message:
 *                       type: string
 *                       example: "email驗證"
 *          "400":
 *             description: 信箱已被註冊過或資料為空
 *             content:
 *               application/json:
 *                 schema:
 *                   type: object
 *                   properties:
 *                     status: 
 *                       type: string
 *                       example: error
 *                     message:
 *                       type: string
 *                       example: "email已被註冊過了"
 *          "500":
 *             description: 伺服器內部錯誤
 *             content:
 *               application/json:
 *                 schema:
 *                   type: object
 *                   properties:
 *                     status:
 *                       type: string
 *                       example: "error"
 *                     message:
 *                       type: string
 *                       example: "內部伺服器出現錯誤"
 */


/**
 * @swagger
 * /send_email:
 *  post:
 *      tags:
 *        - signup and login
 *      description: 註冊時的信箱驗證，以確保信箱是真的
 *      requestBody:
 *        required: true
 *        description: 使用者的email
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                email:
 *                  type: string
 *                  example: "email@gmail.com"
 *      responses:
 *          "200":
 *             description: 信箱驗證碼成功送到使用者信箱，後端會回傳驗證碼給前端，前端使用者輸入正確驗證碼後，才能成功註冊帳號
 *             content:
 *               application/json:
 *                 schema:
 *                   type: object
 *                   properties:
 *                     status: 
 *                       type: string
 *                       example: success
 *                     code:
 *                       type: string
 *                       example: "0403"
 *          "500":
 *             description: 伺服器內部錯誤
 *             content:
 *               application/json:
 *                 schema:
 *                   type: object
 *                   properties:
 *                     status:
 *                       type: string
 *                       example: "error"
 *                     message:
 *                       type: string
 *                       example: "內部伺服器出現錯誤"
 */



/**
 * @swagger
 * /confirm_signup:
 *  post:
 *      tags:
 *        - signup and login
 *      description: 前端使用者已輸入正確的信箱驗證碼，把使用者的資料存到資料庫
 *      requestBody:
 *        required: true
 *        description: 使用者的email
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                email:
 *                  type: string
 *                  example: "email@gmail.com"
 *      responses:
 *          "200":
 *             description: 成功將使用者的資料存到資料庫
 *             content:
 *               application/json:
 *                 schema:
 *                   type: object
 *                   properties:
 *                     status: 
 *                       type: string
 *                       example: success
 *                     message:
 *                       type: string
 *                       example: "註冊成功"
 *          "500":
 *             description: 伺服器內部錯誤
 *             content:
 *               application/json:
 *                 schema:
 *                   type: object
 *                   properties:
 *                     status:
 *                       type: string
 *                       example: "error"
 *                     message:
 *                       type: string
 *                       example: "內部伺服器出現錯誤"
 */



/**
 * @swagger
 * /login:
 *  post:
 *      tags:
 *        - signup and login
 *      description: 登入
 *      requestBody:
 *        required: true
 *        description: 登入資訊
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                email:
 *                  type: string
 *                  example: "email@gmail.com"
 *                password:
 *                  type: string
 *                  example: "123456"
 *      responses:
 *          "200":
 *             description: 登入成功，使用 JWT 加密資訊並存放到 Cookie 中，保存七天
 *             headers:
 *               Set-Cookie:
 *                 description: 用來將 JWT 存放到 Cookie 中
 *                 schema:
 *                   type: string
 *             content:
 *               application/json:
 *                 schema:
 *                   type: object
 *                   properties:
 *                     status: 
 *                       type: string
 *                       example: success
 *                     message:
 *                       type: string
 *                       example: 登入成功
 *          "400":
 *             description: 登入失敗，帳號或密碼錯誤或其他原因
 *             content:
 *               application/json:
 *                 schema:
 *                   type: object
 *                   properties:
 *                     status: 
 *                       type: string
 *                       example: error
 *                     message:
 *                       type: string
 *                       example: 無此用戶
 *          "500":
 *             description: 伺服器內部錯誤
 *             content:
 *               application/json:
 *                 schema:
 *                   type: object
 *                   properties:
 *                     status:
 *                       type: string
 *                       example: "error"
 *                     message:
 *                       type: string
 *                       example: "內部伺服器出現錯誤"
 */


