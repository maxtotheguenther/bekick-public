import * as admin from "firebase-admin"
import * as express from "express";
import to from 'await-to-js';
import { db } from "../..";
import { UserRecord } from "firebase-functions/lib/providers/auth";

// Get single user by uid
const getUser = async(uid: string) => {
  const [, user] = await to(admin.auth().getUser(uid))
  return user
}

const getUserByMail = async(mail: string) => {
    const [, user] = await to(admin.auth().getUserByEmail(mail))
    return user
}

const deletePlayerRequest = async (uid: string) => {
    const [, success] = await to(db.collection("playerRequest").doc(uid).delete())
    return success
}

// Create init player after superadmin accepts player.
const createInitPlayer = async (user: UserRecord) => {
    const [, createdPlayer] = await to(db.collection("players").doc(user.uid).set({
        email: user.email,
        avatar: user.photoURL || "",
        lastName: user.displayName || "",
        firstName: user.displayName || "",
        alias: "rookie",
        created: new Date(),
        disabled: false,
        rookie: true,
        deleteNextSeason: false
    }))
    return createdPlayer
}

// Set claims for uid user. Either superadmin + admin | admin
const setClaims = async ({ uid, superAdmin }: { uid: string, superAdmin?: boolean}) => {
    const claims = superAdmin 
        ? { superAdmin: true, admin: true }
        : { admin: true }
    return admin.auth().setCustomUserClaims(uid, claims)
    .then(() => true)
    .catch(() => false)
} 

export const createInitSuperAdmin = async (req: express.Request, res: express.Response) => {
    const [, user] = await to(getUserByMail("max.guenther.work@gmail.com"))
    if (!user) return res.status(404).send("Default superadmin is not yet available")
    const [, setClaimsSuccess] = await to(setClaims({uid: user.uid, superAdmin: true}))
    if (!setClaimsSuccess) return res.status(500).send("Could not set superadmin perms for default superadmin")
    return res.status(200).send("Default superadmin has now superadmin perms")
}

export const acceptAsSuperadmin = async (req: express.Request, res: express.Response) => {
    if (req.authCtx.superadmin) {
        const uid = req.params.uid
        const [, user] = await to(getUser(uid))
        if (!user) return res.status(404).send(`Could not find user with uid: ${uid}`)
        const [, setClaimsSuccess] = await to(setClaims({ uid: user.uid, superAdmin: true }))
        if (!setClaimsSuccess) return res.status(500).send(`Could not set superadmin perms for user: ${uid}`)
        const [, createdPlayer] = await to(createInitPlayer(user))
        if (!createdPlayer) return res.status(500).send(`Could not save entry to db for user: ${uid}`)
        const [, deletePlayerRequestSuccess] = await to(deletePlayerRequest(uid))
        if (!deletePlayerRequestSuccess) return res.status(500).send(`Could not delete playerRequest for user: ${uid}`)
        return res.status(200).send(`Set superadmin perms for user: ${uid}`)
    } else {
        return res.status(401).send("Forbidden")
    }
}

export const acceptAsAdmin = async (req: express.Request, res: express.Response) => {
    if (req.authCtx.superadmin) {
        const uid = req.params.uid
        const [, user] = await to(getUser(uid))
        if (!user) return res.status(404).send(`Could not find user with uid: ${uid}`)
        const [, setClaimsSuccess] = await to(setClaims({ uid: user.uid }))
        if (!setClaimsSuccess) return res.status(500).send(`Could not set admin perms for user: ${uid}`)
        const [, createdPlayer] = await to(createInitPlayer(user))
        if (!createdPlayer) return res.status(500).send(`Could not save entry to db for user: ${uid}`)
        const [, deletePlayerRequestSuccess] = await to(deletePlayerRequest(uid))
        if (!deletePlayerRequestSuccess) return res.status(500).send(`Could not delete playerRequest for user: ${uid}`)
        return res.status(200).send(`Set admin perms for user: ${uid}`)
    } else {
        return res.status(401).send("Forbidden")
    }
}

export const blockUser = async (req: express.Request, res: express.Response) => {
    if (req.authCtx.superadmin) {
        const uid = req.params.uid
        const [, deletePlayerRequestSuccess] = await to(deletePlayerRequest(uid))
        if (!deletePlayerRequestSuccess) return res.status(500).send(`Could not delete playerRequest for user: ${uid}`)
        return admin.auth().deleteUser(uid)
        .then(() => res.status(200).send(`Successfully deleted user with uid: ${uid}`))
        .catch(() => res.status(500).send(`Could not delete user with uid: ${uid}`))
    } else {
        return res.status(401).send("Forbidden")
    }
}