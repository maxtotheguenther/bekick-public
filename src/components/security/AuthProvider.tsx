import * as React from "react";
import { auth } from "../../firebase/firebase";
import { User } from "firebase";

export interface AuthCtx {
    user: User | null
    tokenParsed: firebase.auth.IdTokenResult | null
    token: string
}

export const AuthContext = React.createContext<AuthCtx | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [authCtx, setAuthCtx] = React.useState<AuthCtx | null>(null)

    React.useEffect(() => {
        // Solange wie authctx berechnet wird loading spinner
        auth.onAuthStateChanged(user => {
            if (user) {
                user.getIdTokenResult(true).then(tokenParsed => {
                    setAuthCtx({ user, token: tokenParsed.token, tokenParsed })
                })
            }
            setAuthCtx({ user, token: "", tokenParsed:null })
        });
    }, []);

    return (
        <AuthProviderSub authCtx={authCtx}>
            {children}
        </AuthProviderSub>
    );
};

const AuthProviderSub = ({ children, authCtx }: { children: React.ReactNode, authCtx: AuthCtx | null }) => {
    if (!authCtx) return null // Always wait for authCtx creation before rendering application
    return <AuthContext.Provider value={authCtx}>
        {children}
    </AuthContext.Provider>
}

interface IUseAuthCtx {
    authCtx: AuthCtx,
    admin: boolean,
    superAdmin: boolean,
    anonymousUser: boolean,
    signedInUser: boolean
}
export const useAuthCtx: () => IUseAuthCtx = () => {
    const authCtx = React.useContext(AuthContext);
    if (!authCtx) {
        throw new Error("[UseAuthCtx] Seems no authCtx was created yet.")
    } else {
        return {
          authCtx,
          admin: getPerm("admin", authCtx.tokenParsed),
          superAdmin: getPerm("superAdmin", authCtx.tokenParsed),
          anonymousUser: anonymousUser(authCtx),
          signedInUser: signedInUser(authCtx)
        };
    }
}

interface IUseUser {
    user: User,
    mail: string
}
export const useUser = (): IUseUser => {
    const { authCtx } = useAuthCtx()
    return {
        user: getUserOrError(authCtx),
        mail: getEmailOrError(authCtx)
    }
}

const getUserOrError = (authCtx: AuthCtx) => {
  if (authCtx.user) {
    return authCtx.user;
  }
  throw new Error("[UserAuthCtx] firebase.User seems to be null.");
};

const getPerm = (perm: string, tokenParsed: firebase.auth.IdTokenResult | null) =>
    (tokenParsed && tokenParsed.claims[perm] as boolean) || false
    

const getEmailOrError = (authCtx: AuthCtx) => {
  const user = getUserOrError(authCtx);
  const email = user.email
  if (email) return email;
  throw new Error("[AuthProvider] firebase.User has no email.");
};

const anonymousUser = (authCtx: AuthCtx) => (authCtx.user ? false : true);

const signedInUser = (authCtx: AuthCtx) => !anonymousUser(authCtx);