import { db } from "../firebase"

export const dashboardCollection = db.collection("dashboard");

export const ACTIVE_GAME = "activegame"

export const MATCH_FIELDS = {
    KEEPER_WHITE: "keeperWhite",
    STRIKER_WHITE: "strikerWhite",
    KEEPER_BLACK: "keeperBlack",
    STRIKER_BLACK: "strikerBlack"
}

export const setInitMatch = () => {
    return dashboardCollection.doc(ACTIVE_GAME).set({
        [MATCH_FIELDS.KEEPER_WHITE]: "",
        [MATCH_FIELDS.STRIKER_WHITE]: "",
        [MATCH_FIELDS.KEEPER_BLACK]: "",
        [MATCH_FIELDS.STRIKER_BLACK]: "",
        startedAt: new Date(),
        deathmatch: false,
        rookiegame: false,
        endedAt: new Date(),
        goalsBlack: 0,
        goalsWhite: 0
    })
    .then(() => console.log("Successfully created init match"))
    .catch((err: Error) => console.error(err))
}

export const updateActiceGame = (updateObj: any) => {
    dashboardCollection.doc(ACTIVE_GAME).update(updateObj)
    .then(() => console.log("[Dashboard.activegame] update success with body", updateObj))
    .catch((err: Error) => console.error(err))
}