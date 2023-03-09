/**
 * @swagger
 * /api/user_data:
 *  get:
 *      tags:
 *        - member
 *      description: 取得使用者的資料
 *      responses:
 *          "200":
 *             description: 請求成功，成功取得使用者的資料
 *             content:
 *               application/json:
 *                 schema:
 *                   type: object
 *                   properties:
 *                     nickname:
 *                       type: string
 *                       example: "毛毛"
 *                     email:
 *                       type: string
 *                       example: "maomao@gmail.com"
 *                     headshot:
 *                       type: string
 *                       example: "https://example.com/john.png"
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
 * /nickname:
 *  put:
 *      tags:
 *        - member
 *      description: 更新使用者暱稱
 *      responses:
 *          "200":
 *             description: 請求成功，成功更新使用者的暱稱
 *             content:
 *               application/json:
 *                 schema:
 *                   type: object
 *                   properties:
 *                     status:
 *                       example: "success"
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
 * /verify_email:
 *  post:
 *      tags:
 *        - member
 *      description: 使用者更新信箱的驗證
 *      responses:
 *          "200":
 *             description: 請求成功，傳送信箱驗證碼到前端，看前端是否有輸入正確
 *             content:
 *               application/json:
 *                 schema:
 *                   type: object
 *                   properties:
 *                     status:
 *                       example: "success"
 *                     code:
 *                       description: 信箱的驗證碼，傳去前端做比對
 *                       type: integer
 *                       example: 1234
 *          "400":
 *             description: 請求失敗，信箱已被使用過等原因
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
 *                       example: 信箱已被使用過
 *          "500":
 *             description: 請求失敗，內部伺服器出現錯誤
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
 *                       example: 內部伺服器出現錯誤
 */


/**
 * @swagger
 * /email:
 *  put:
 *      tags:
 *        - member
 *      description: 更新使用者的信箱
 *      responses:
 *          "200":
 *             description: 請求成功，成功更新使用者的信箱
 *             content:
 *               application/json:
 *                 schema:
 *                   type: object
 *                   properties:
 *                     status:
 *                       type: string
 *                       example: success
 *          "500":
 *             description: 請求失敗，內部伺服器出現錯誤
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
 * /headshot:
 *  put:
 *      tags:
 *        - member
 *      description: 更新使用者的頭貼
 *      responses:
 *          "200":
 *             description: 請求成功，成功更新使用者的頭貼
 *             content:
 *               application/json:
 *                 schema:
 *                   type: object
 *                   properties:
 *                     status:
 *                       type: string
 *                       example: success
 *          "500":
 *             description: 請求失敗，內部伺服器出現錯誤
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




