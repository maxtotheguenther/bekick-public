import { db } from "../firebase"
import Match from "../../models/Match";

export const playerCollection = db.collection("dashboard");


export const saveMatch = (match: Match, uid?: string) =>
    uid ? playerCollection.doc(uid).set(match) : playerCollection.doc().set(match)
    

export const updateMatch = (uid: string, match: Match) =>
    saveMatch(match, uid)