import * as React from "react";
import { Route } from "react-router-dom";
import { useAuthCtx } from "./AuthProvider";
import Forbidden from "./401";

interface SecuredRouteProps {
  component: React.FunctionComponent<any>
  exact: boolean
  path: string
  needsSuperadmin?: boolean
}
export default function SecuredRoute({ component, exact, path, needsSuperadmin}: SecuredRouteProps) {
  const { authCtx: { user, token }, superAdmin, admin } = useAuthCtx();
  if (user && needsSuperadmin && superAdmin) 
    return <Route exact={exact} path={path} component={component} />

  if (!needsSuperadmin && user && (admin || superAdmin))
    return <Route exact={exact} path={path} component={component} />

  return <Forbidden />;
}
