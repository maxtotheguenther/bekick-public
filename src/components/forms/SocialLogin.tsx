import * as React from "react";
import Button from "@material-ui/core/Button";
import ROUTES from "../../routes";
import { doGoogleSignInSignUp } from "../../firebase/auth/auth";
import { useHistory } from "react-router";
import { successNotification, errorNotification } from "../../functions/notifications";

const SocialLogin = () => {
    const history = useHistory();
    const signInWithGoogle = () => {
        doGoogleSignInSignUp()
        .then(({additionalUserInfo}) => {
            const msg = (additionalUserInfo && additionalUserInfo.isNewUser)
                ? "Willkommen bei Bekick!"
                : "Willkommen zurück!"
            successNotification(msg);
            history.push(ROUTES.PROFILE);
        })
        .catch((err: Error) => {
            console.error("err")
            errorNotification("Whoops something went wrong. Please try again!")
        })
    };

    return <>
        <p>Or with some others...</p>
        <Button onClick={() => signInWithGoogle()} variant="contained">
            Sign In Via Google
        </Button>
    </>
}

export default SocialLogin;