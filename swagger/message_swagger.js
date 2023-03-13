/**
 * @swagger
 * /api/message:
 *  post:
 *      tags:
 *        - message
 *      description: 取得使用者的聊天室的聊天紀錄
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                friendId:
 *                  type: integer
 *                  example: 17
 *                myId:
 *                  type: integer
 *                  example: 18
 *              required:
 *                - friendId
 *                - myId
 *      responses:
 *          "200":
 *             description: 請求成功，取得使用者的聊天室的聊天紀錄
 *             content:
 *               application/json:
 *                 schema:
 *                   type: object
 *                   properties:
 *                     status: 
 *                       type: string
 *                       example: success
 *                     message:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           sender_id: 
 *                             type: integer
 *                             example: 17
 *                           recipient_id: 
 *                             type: integer
 *                             example: 6
 *                           message:
 *                             type: string
 *                             example: hello
 *                           is_read: 
 *                             type: integer
 *                             example: 0
 *                           time:  
 *                            type: string
 *                            example: 2023-02-25T10:43:40.000Z
 *                       example:
 *                         - sender_id: 17
 *                           recipient_id: 6
 *                           message: hello
 *                           is_read: 0
 *                           time: 2023-02-25T10:43:40.000Z
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
 * /friend_status:
 *  get:
 *      tags:
 *        - message
 *      description: 確認雙方是否為好友
 *      parameters:
 *        - name: friendId
 *          in: query
 *          description: 通話對象的id
 *          required: true
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
 *                       example: "success"
 *          "400":
 *             description: 請求失敗，有一方並非對方好友
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
 *                       example: "需要雙方都為好友才能撥打"
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
 * /api/latest_group_message:
 *  get:
 *      tags:
 *        - message
 *      description: 取得最新的群組歷史聊天訊息
 *      responses:
 *          "200":
 *             description: 請求成功，取得使用者最新的群組歷史訊息
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
 *                           group_id: 
 *                             type: string
 *                             example: "b3d8da0a-0c23-48c1-ae3a-098e12424fce"
 *                           sender_id: 
 *                             type: integer
 *                             example: 17
 *                           message:
 *                             type: string
 *                             example: hello
 *                           group_headshot: 
 *                             type: string
 *                             example: "http://group_headshot.png"
 *                           group_name:  
 *                             type: string
 *                             example: "比奇堡"
 *                           is_read:
 *                             type: integer
 *                             example: 0
 *                       example:
 *                         - group_id: "b3d8da0a-0c23-48c1-ae3a-098e12424fce"
 *                           sender_id: 17
 *                           message: hello
 *                           group_headshot: "http://group_headshot.png"
 *                           group_name: "比奇堡"
 *                           is_read: 0
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
 * /api/latest_message:
 *  get:
 *      tags:
 *        - message
 *      description: 取得最新的單人歷史聊天訊息
 *      responses:
 *          "200":
 *             description: 請求成功，取得使用者最新的單人歷史聊天訊息
 *             content:
 *               application/json:
 *                 schema:
 *                   type: object
 *                   properties:
 *                     result:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           sender_nickname: 
 *                             type: string
 *                             example: "海綿寶寶"
 *                           recipient_nickname: 
 *                             type: string
 *                             example: "派大星"
 *                           sender_headshot:
 *                             type: string
 *                             example: "https://headshot.png"
 *                           recipient_headshot: 
 *                             type: string
 *                             example: "https://headshot.png"
 *                           sender_id:  
 *                             type: integer
 *                             example: 17
 *                           recipient_id:
 *                             type: integer
 *                             example: 18
 *                           message:
 *                             type: string
 *                             example: "hello"
 *                           time:
 *                             type: string
 *                             example: "2023-03-10T13:02:40.000Z"
 *                           is_read:
 *                             type: integer
 *                             example: 0
 *                           non_friend_id:
 *                             type: integer
 *                             example: 0
 *                       example:
 *                         - sender_nickname: "海綿寶寶"
 *                           recipient_nickname: "派大星"
 *                           sender_headshot: "https://headshot.png"
 *                           recipient_headshot: "https://headshot.png"
 *                           sender_id: 17
 *                           recipient_id: 18
 *                           message: "hello"
 *                           time: "2023-03-10T13:02:40.000Z"
 *                           is_read: 0
 *                           non_friend_id: 0
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
 * /message_status:
 *  put:
 *      tags:
 *        - message
 *      description: 更新聊天室的已讀狀態，並存到資料庫中
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                sender_id:
 *                  type: integer
 *                  example: 17
 *              required:
 *                - sender_id
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
 * /group_message_status:
 *  put:
 *      tags:
 *        - message
 *      description: 更新群組聊天室的已讀狀態，並存到資料庫中
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                groupId:
 *                  type: string
 *                  example: "b3d8da0a-0c23-48c1-ae3a-098e12424fce"
 *              required:
 *                - groupId
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
 * /chat_picture:
 *  post:
 *      tags:
 *        - message
 *      description: 取得單人聊天室所有上傳的圖片跟影片
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                recipientId:
 *                  type: integer
 *                  example: 17
 *              required:
 *                - recipientId
 *      responses:
 *          "200":
 *             description: 請求成功
 *             content:
 *               application/json:
 *                 schema:
 *                   type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           message: 
 *                             type: string
 *                             example: "https://picture.png"
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
 * /group_picture:
 *  post:
 *      tags:
 *        - message
 *      description: 取得群組聊天室所有上傳的圖片跟影片
 *      parameters:
 *        - name: groupId
 *          in: query
 *          description: 群組id
 *          required: true
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
 *                     data:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           message: 
 *                             type: string
 *                             example: "https://picture.png"
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
 * /file:
 *  post:
 *      tags:
 *        - message
 *      description: 使用者在聊天室上傳檔案，後端儲存到資料庫
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                file:
 *                  type: string
 *                dataType:
 *                  type: string
 *                  example: image
 *                fileName:
 *                  type: string
 *                  example: "檔案名"
 *                time: 
 *                  type: string
 *                  example: 2023-02-25T10:43:40.000Z
 *              required:
 *                - file
 *                - dataType
 *                - fileName
 *                - time
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
 *                       example: "https://file"
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