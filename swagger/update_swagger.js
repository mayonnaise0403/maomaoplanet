/**
 * @swagger
 * /group:
 *  post:
 *      tags:
 *        - update
 *      description: 建立新的群組
 *      requestBody:
 *        description: 取得使用者輸入的群組名稱，和取得群組成員id
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                groupName:
 *                  type: string
 *                  example: "我的群組"
 *                groupMemberIdArr:
 *                  type: array
 *                  example: [15,6,4]
 *      responses:
 *          "200":
 *             description: 群組建立成功
 *             content:
 *               application/json:
 *                 schema:
 *                   type: object
 *                   properties:
 *                     status:
 *                       type: string
 *                       example: "success"
 *                     groupId: 
 *                       type: string
 *                       example: "5d3dbb57-637b-40c8-98c0-1d3e157713d3"
 *                     groupName:
 *                       type: string
 *                       example: 群組名稱
 *                     group_data:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           nickname:
 *                             type: string
 *                             example: "海綿寶寶"
 *                           user_id:
 *                             type: integer
 *                             example: 15
 *                           headshot:
 *                             type: string
 *                             example: "https://headshot.png"
 *                       
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
 * /new_group_user:
 *  post:
 *      tags:
 *        - update
 *      description: 把新成員加入群組
 *      requestBody:
 *        description: 使用者資料
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                groupId:
 *                  type: string
 *                  example: "5d3dbb57-637b-40c8-98c0-1d3e157713d3"
 *                userId:
 *                  type: integer
 *                  example: 9
 *      responses:
 *          "200":
 *             description: 群組建立成功
 *             content:
 *               application/json:
 *                 schema:
 *                   type: object
 *                   properties:
 *                     status:
 *                       type: string
 *                       example: "success"
 *                       
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
 * /group_name:
 *  put:
 *      tags:
 *        - update
 *      description: 更新群組名稱
 *      requestBody:
 *        description: 使用者資料
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                groupId:
 *                  type: string
 *                  example: "5d3dbb57-637b-40c8-98c0-1d3e157713d3"
 *                groupName:
 *                  type: string
 *                  example: 新的群組名稱
 *      responses:
 *          "200":
 *             description: 群組名稱更新成功
 *             content:
 *               application/json:
 *                 schema:
 *                   type: object
 *                   properties:
 *                     status:
 *                       type: string
 *                       example: "success"
 *                     newGroupName:
 *                       type: string
 *                       example: "新群組名稱"
 *                       
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
 * /leave_group:
 *  put:
 *      tags:
 *        - update
 *      description: 退出群組
 *      requestBody:
 *        description: 使用者資料
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                groupId:
 *                  type: string
 *                  example: "5d3dbb57-637b-40c8-98c0-1d3e157713d3"
 *      responses:
 *          "200":
 *             description: 成功退出群組，並更新資料庫
 *             content:
 *               application/json:
 *                 schema:
 *                   type: object
 *                   properties:
 *                     status:
 *                       type: string
 *                       example: "success"
 *                       
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
 * /group_headshot:
 *  put:
 *      tags:
 *        - update
 *      description: 更新群組頭貼
 *      requestBody:
 *        description: 使用者資料
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                groupId:
 *                  type: string
 *                  example: "5d3dbb57-637b-40c8-98c0-1d3e157713d3"
 *                image:
 *                  type: string
 *      responses:
 *          "200":
 *             description: 成功更新群組頭貼，並更新資料庫
 *             content:
 *               application/json:
 *                 schema:
 *                   type: object
 *                   properties:
 *                     status:
 *                       type: string
 *                       example: "success"
 *                     images:
 *                       type: string
 *                       
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