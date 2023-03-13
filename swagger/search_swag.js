
/**
 * @swagger
 * /friend:
 *  post:
 *      tags:
 *        - search
 *      description: 與使用者加好友
 *      requestBody:
 *        description: 看使用者是使用名字加好友，還是使用email加好友
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                email:
 *                  type: string
 *                  example: "email@gmail.com"
 *                friend_id:
 *                  type: integer
 *                  example: 17
 *      responses:
 *          "200":
 *             description: 請求成功
 *             content:
 *               application/json:
 *                 schema:
 *                   type: object
 *                   properties:
 *                     status:
 *                       type: string
 *                       example: "success"
 *                     message: 
 *                       type: string
 *                       example: "加好友成功"
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
 * /api/user:
 *  get:
 *      tags:
 *        - search
 *      description: 顯示搜尋的使用者資料
 *      parameters:
 *        - name: nickname
 *          in: query
 *          description: 使用者暱稱
 *          schema:
 *            type: integer
 *        - name: email
 *          in: query
 *          description: 使用者信箱
 *          schema:
 *            type: integer
 *      responses:
 *          "200":
 *             description: 請求成功
 *             content:
 *               application/json:
 *                 schema:
 *                   type: object
 *                   properties:
 *                     status: 
 *                       type: string
 *                       example: success
 *                     user:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           user_id: 
 *                             type: integer
 *                             example: 17
 *                           nickname: 
 *                             type: string
 *                             example: "毛毛"
 *                           email:
 *                             type: string
 *                             example: "rita09436@gmail.com"
 *                           headshot: 
 *                             type: string
 *                             example: "http://headshot.png"
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
 * /api/add_user_to_group_friendlist:
 *  get:
 *      tags:
 *        - search
 *      description: 加入新成員到群組的好友列表
 *      parameters:
 *        - name: groupId
 *          in: query
 *          description: 群組id
 *          schema:
 *            type: string
 *      responses:
 *          "200":
 *             description: 請求成功
 *             content:
 *               application/json:
 *                 schema:
 *                   type: object
 *                   properties:
 *                     status: 
 *                       type: string
 *                       example: success
 *                     friend_list:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           user_id: 
 *                             type: integer
 *                             example: 17
 *                           nickname: 
 *                             type: string
 *                             example: "毛毛"
 *                           headshot: 
 *                             type: string
 *                             example: "http://headshot.png"
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
 * /api/friendlist:
 *  get:
 *      tags:
 *        - search
 *      description: 取得好友列表
 *      responses:
 *          "200":
 *             description: 請求成功
 *             content:
 *               application/json:
 *                 schema:
 *                   type: object
 *                   properties:
 *                     status: 
 *                       type: string
 *                       example: success
 *                     self_id:
 *                       type: integer
 *                       example: 27
 *                     friend_list:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           user_id: 
 *                             type: integer
 *                             example: 17
 *                           nickname: 
 *                             type: string
 *                             example: "毛毛"
 *                           headshot: 
 *                             type: string
 *                             example: "http://headshot.png"
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
 * /api/grouplist:
 *  get:
 *      tags:
 *        - search
 *      description: 取得群組列表
 *      responses:
 *          "200":
 *             description: 請求成功
 *             content:
 *               application/json:
 *                 schema:
 *                   type: object
 *                   properties:
 *                     status: 
 *                       type: string
 *                       example: success
 *                     group_list:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           group_name: 
 *                             type: string
 *                             example: "蟹堡王"
 *                           group_id: 
 *                             type: string
 *                             example: "e4b9b1b3-c78a-49ab-927c-ccd580906081"
 *                           headshot: 
 *                             type: string
 *                             example: "http://headshot.png"
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
 * /api/group_member:
 *  get:
 *      tags:
 *        - search
 *      description: 取得群組列表
 *      parameters:
 *        - name: groupId
 *          required: true
 *          in: query
 *          description: 群組id
 *          schema:
 *            type: string
 *      responses:
 *          "200":
 *             description: 請求成功
 *             content:
 *               application/json:
 *                 schema:
 *                   type: object
 *                   properties:
 *                     status: 
 *                       type: string
 *                       example: success
 *                     data:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           nickname: 
 *                             type: string
 *                             example: "章魚哥"
 *                           headshot: 
 *                             type: string
 *                             example: "http://headshot.png"
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