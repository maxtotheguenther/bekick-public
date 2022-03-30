import * as express from "express";
import * as admin from "firebase-admin"

// Check if user as valid token and extract some data from it
export const withAuthCtx = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const extractToken = () => {
        if (
            req.headers.authorization &&
            req.headers.authorization.split(' ')[0] === 'Bearer'
        ) {
            return req.headers.authorization.split(' ')[1];
        }
        return null
    }
    const token = extractToken();
    if (token) {
        admin.auth().verifyIdToken(token)
        .then(firebaseToken => {
            const isSuperadmin = firebaseToken.superAdmin === true
            const isAdmin = firebaseToken.admin === true
            const uid = firebaseToken.uid
            req.authCtx = {
                admin: isAdmin,
                superadmin: isSuperadmin,
                uid
            }
            next()
        })
        .catch(() => {
            res.status(401).send("Unauthorized...")
        })
    } else {
        res.status(401).send("Unauthorized...")
    }
    
    
}