'use strict';

import * as functions from 'firebase-functions'
import * as admin from "firebase-admin"
import * as express from "express"
import * as cors from "cors";
import { createInitSuperAdmin, acceptAsSuperadmin, acceptAsAdmin, blockUser } from './https/auth';
import { withAuthCtx } from './https/utils/tokenValidator';

const config = functions.config()
admin.initializeApp(config)
export const db = admin.firestore();

/**
 * USER CREATION
 */
exports.playerRequest = functions.auth.user().onCreate((user) => {
    if (!user.email) throw new Error("[Func.playerRequest] missing email...")
    // Make a playerRequest to check if registered user is valid. We dont want unknown players.
    db.collection("playerRequest").doc(user.uid).set({
        email: user.email
    })
    .then(() => console.log(`[Func.playerRequest] successfully created: ${user.email}`))
    .catch((err: Error) => console.error(`[Func.playerRequest] error while creating: ${user.email}`, err))
})

/**
 * BEKICK-API
 */
const app = express();
const corsHandler = cors({ origin: true});
app.use(corsHandler)
const router = express.Router();
app.use(router);

router.post("/create-init-super-admin", createInitSuperAdmin)
router.post("/playerReq/accept-as-super-admin/:uid", withAuthCtx, acceptAsSuperadmin)
router.post("/playerReq/accept-as-admin/:uid", withAuthCtx, acceptAsAdmin)
router.post("/playerReq/block/:uid", withAuthCtx, blockUser)


export const api = functions.https.onRequest(app)