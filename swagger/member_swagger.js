/**
 * @openapi
 * /api/user_data:
 *  get:
 *      tags:
 *        - member
 *      description: 取得使用者的資料
 *      responses:
 *          "200":
 *             description: 請求成功
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
 * @openapi
 * /nickname:
 *  put:
 *      tags:
 *        - member
 *      description: 取得使用者的資料
 *      responses:
 *          "200":
 *             description: 請求成功
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


