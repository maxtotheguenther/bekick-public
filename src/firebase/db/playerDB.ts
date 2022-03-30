import { db } from "../firebase"
import Player from "../../models/Player";

export const playerCollection = db.collection("players");

export const savePlayer = (uid: string, player :Player) =>
    playerCollection.doc(uid).set(player)

export const updatePlayer = (uid: string, player: Player) =>
    savePlayer(uid, player)