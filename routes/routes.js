import express from 'express';
const router = express.Router();
import userController from "../controllers/user.controller.js"
import videoController from "../controllers/video.controller.js"
import securityController from "../controllers/security.controller.js"
import middleware from "../middlewares/middleware.js"
import user_videoController from "../controllers/user_video.controller.js"

/**
 * @swagger
 * paths:
 *  /login:
 *   post:
 *      tags:
 *          - user
 *      description: Login user
 *      responses:
 *       200: 
 *        description: Successful operation
 *       401: 
 *        description: Wrong data
 *      requestBody:
 *            required: true
 *            description: User data for authorize
 *            content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/definitions/UserToLogin'
 */
router.post("/login", securityController.login);

/**
 * @swagger
 * paths:
 *  /register:
 *   post:
 *      tags:
 *          - user
 *      description: Register user
 *      responses:
 *       200: 
 *        description: Successful operation
 *       401: 
 *        description: Wrong data
 *      requestBody:
 *            required: true
 *            description: User data for register
 *            content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/definitions/UserToCreate'
 */
router.post("/register", userController.registerUser);

/**
 * @swagger
 * paths:
 *  /user/video:
 *   get:
 *      tags:
 *          - user-favorities
 *      security:
 *          - bearerAuth: []
 *      description: Get videos from database.
 *      responses:
 *       200: 
 *        description: favourities videos
 */
router.get("/user/video", middleware.authenticateToken, user_videoController.getFavourities);

/**
 * @swagger
 * paths:
 *  /user/video/{videoId}:
 *   post:
 *      tags:
 *          - user-favorities
 *      security:
 *          - bearerAuth: []
 *      description: Get videos from database.
 *      responses:
 *       204: 
 *        description: Add to database
 *      parameters:
 *          - name: videoId
 *            in: path
 *            required: false
 *            description: videoId which we want to add to favourites
 *            schema:
 *              type: string
 */
router.post("/user/video/:videoId", middleware.authenticateToken, user_videoController.addToFavorites);

/**
 * @swagger
 * paths:
 *  /user/video/{videoId}:
 *   delete:
 *      tags:
 *          - user-favorities
 *      security:
 *          - bearerAuth: []
 *      description: Delete from favourities.
 *      responses:
 *       204: 
 *        description: deleted from database
 *      parameters:
 *          - name: videoId
 *            in: path
 *            required: false
 *            description: videoId which we want to delete from favourites
 *            schema:
 *              type: string
 */
router.delete("/user/video/:videoId", middleware.authenticateToken, user_videoController.deleteFromFavorites);

/**
 * @swagger
 * paths:
 *  /video:
 *   post:
 *      tags:
 *          - video
 *      security:
 *          - bearerAuth: []
 *      description: Add video from database.
 *      responses:
 *       200: 
 *        description: Successful operation
 *      requestBody:
 *            required: true
 *            description: Video object
 *            content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/definitions/VideoToCreate'
 */
router.post("/video", middleware.authenticateToken, videoController.addVideo);

/**
 * @swagger
 * paths:
 *  /refresh:
 *   post:
 *      tags:
 *          - user
 *      description: Refresh token
 *      responses:
 *       200: 
 *        description: Successful operation
 *       401: 
 *        description: Wrong data
 *      requestBody:
 *            required: true
 *            description: token
 *            content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/definitions/Token'
 */
router.post("/refresh", securityController.refresh);

router.get('/initialize-video', videoController.initializedVideos);
router.get('/initialize-users', userController.initliaizedUsers);

/**
 * @swagger
 * paths:
 *  /video:
 *   get:
 *      tags:
 *          - video
 *      security:
 *          - bearerAuth: []
 *      description: Get videos from database.
 *      responses:
 *       200: 
 *        description: Successful operation
 *      parameters:
 *          - name: random
 *            in: query
 *            required: false
 *            description: Use of random parameter allows to get randomly selected videos
 *            schema:
 *              type: boolean
 *          - name: tag
 *            in: query
 *            required: false
 *            description: tags needs to be entered without hash
 *            schema:
 *              type: string
 */
router.get("/video", middleware.authenticateToken, videoController.searchVideo);

/**
 * @swagger
 * paths:
 *  /video:
 *   put:
 *      tags:
 *          - video
 *      security:
 *          - bearerAuth: []
 *      description: Update video in database.
 *      responses:
 *       200: 
 *        description: Successful operation
 *       401: 
 *        description: Access denied
 *      requestBody:
 *          required: true
 *          description: Video model to update
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/definitions/VideoToUpdate'
 */
router.put("/video", middleware.authenticateToken, videoController.updateVideo);

/**
 * @swagger
 * definitions:
 *  UserToLogin:
 *      type: object
 *      required:
 *          - email
 *          - password
 *      properties:
 *          email:
 *              type: string
 *          password:
 *              type: string
 *  UserToCreate:
 *      type: object
 *      required:
 *          - _id
 *          - firstName
 *          - username
 *          - email
 *          - password
 *      properties:
 *          _id:
 *              type: string
 *          firstName:
 *              type: string
 *          lastName:
 *              type: string
 *          username:
 *              type: string
 *          age:
 *              type: number
 *          email:
 *              type: string
 *          password:
 *              type: string
 *  UserToUpdate:
 *      type: object
 *      required:
 *          - _id
 *      properties:
 *          _id:
 *              type: string
 *          firstName:
 *              type: string
 *          lastName:
 *              type: string
 *          username:
 *              type: string
 *          age:
 *              type: number
 *          email:
 *              type: string
 *          password:
 *              type: string
 *  VideoToCreate:
 *      type: object
 *      required:
 *          - _id
 *          - url
 *          - title
 *          - tags
 *      properties:
 *          _id:
 *              type: string
 *          url:
 *              type: string
 *          title:
 *              type: string
 *          description:
 *              type: string
 *          tags:
 *              type: string
 *          uploadedBy:
 *              type: string
 *          contactEmail:
 *              type: string
 *          archived:
 *              type: boolean
 *  VideoToUpdate:
 *      type: object
 *      required:
 *          - _id
 *      properties:
 *          _id:
 *              type: string
 *          url:
 *              type: string
 *          title:
 *              type: string
 *          description:
 *              type: string
 *          tags:
 *              type: string
 *          uploadedBy:
 *              type: string
 *          contactEmail:
 *              type: string
 *          archived:
 *              type: boolean
 *  Token:
 *      type: object
 *      required:
 *          - token
 *      properties:
 *          token:
 *              type: string
 */

export { router };