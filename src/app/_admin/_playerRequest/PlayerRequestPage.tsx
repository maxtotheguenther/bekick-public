import * as React from "react";
import FAAS from "../../../config";
import Button from "@material-ui/core/Button";
import PlayerRequest from "../../../models/PlayerRequest";
import { useCollection } from "../../../firebase/db/useSnapshot";
import { useAuthCtx } from "../../../components/security/AuthProvider";
import { playerReqDb } from "../../../firebase/db/playerRequestDB";
import { errorNotification, successNotification } from "../../../functions/notifications";

const PlayerRequestPage: React.FC = () => {
    const { authCtx: { token } } = useAuthCtx();
    const [models] = useCollection<PlayerRequest>(playerReqDb)

    const acceptUserAsSuperadmin = (uid: string) => {    
        fetch(`${FAAS.API}/playerReq/accept-as-super-admin/${uid}`, {
            method: "POST",
            headers: { "authorization": `Bearer ${token}` }
        })
        .then(({ok}) => {
            ok 
            ? successNotification("Accepted given user as superAdmin.") 
            : errorNotification("Whoops. Couldnt accept user as superAdmin.")
        })
        .catch((err: Error) => {
            console.error(err)
            errorNotification("Whoops. Couldnt accept user as superAdmin.")
        })
    }

    const acceptUserAsAdmin = (uid: string) => {
        fetch(`${FAAS.API}/playerReq/accept-as-admin/${uid}`, {
            method: "POST",
            headers: { "authorization": `Bearer ${token}` }
        })
        .then(({ ok }) => {
            ok
                ? successNotification("Accepted given user as admin.")
                : errorNotification("Whoops. Couldnt accept user as admin.")
        })
        .catch((err: Error) => {
            console.error(err)
            errorNotification("Whoops. Couldnt accept user as admin.")
        })
    }

    const blockRequest = (uid: string) => {
        fetch(`${FAAS.API}/playerReq/block/${uid}`, {
            method: "POST",
            headers: { "authorization": `Bearer ${token}` }
        })
        .then(({ok}) => {
            ok
                ? successNotification("Blocked user.")
                : errorNotification("Whoops. Couldnt block user.")
        })
        .catch((err: Error) => {
            console.error(err)
            errorNotification("Whoops. Couldnt block user.")
        })
    }

    if (!models) return null
    return <>
        <h1>Player Request Page</h1>
        {models.map((model) => {
            return <div key={model.uid}>
                <p>{model.uid}</p>
                <p>{model.data.email}</p>
                <Button onClick={() => acceptUserAsSuperadmin(model.uid)} type="submit" variant="contained">
                    Superadmin
                </Button>
                <Button onClick={() => acceptUserAsAdmin(model.uid)} type="submit" variant="contained">
                    Admin
                </Button>
                <Button onClick={() => blockRequest(model.uid)} type="submit" variant="contained">
                    Block
                </Button>
            </div>
        })}
    </>
}

export default PlayerRequestPage