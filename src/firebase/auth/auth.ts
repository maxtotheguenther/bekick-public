import * as firebase from "firebase";
import { auth } from "../firebase";
import { savePlayer } from "../db/playerDB";

/**
 * Social Media Provider
 */
export const googleProvider = new firebase.auth.GoogleAuthProvider()

export const doSignUp = ({ email, password }: { email: string, password: string }) =>
    auth.setPersistence(firebase.auth.Auth.Persistence.SESSION).then(() =>
        auth.createUserWithEmailAndPassword(email, password)
    )

export const doSignInWithEmailAndPassword = ({ email, password }: { email: string, password: string }) =>
    auth.setPersistence(firebase.auth.Auth.Persistence.SESSION).then(() =>
        auth.signInWithEmailAndPassword(email, password)
            .then(({ user, additionalUserInfo }) => {
                if (user && additionalUserInfo) {
                    return { user, additionalUserInfo }
                }
                throw new Error("Could not signIn user with email and password")
            })
    );

export const doGoogleSignInSignUp = () =>
    auth.setPersistence(firebase.auth.Auth.Persistence.SESSION).then(() =>
        auth.signInWithPopup(googleProvider)
    );