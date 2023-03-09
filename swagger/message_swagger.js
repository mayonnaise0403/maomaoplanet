/**
 * @swagger
 * /api/message:
 *  post:
 *      tags:
 *        - message
 *      description: 取得使用者的聊天室的聊天紀錄
 *      responses:
 *          "200":
 *             description: 請求成功，使用者的聊天室的聊天紀錄
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