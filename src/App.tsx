import * as React from "react";
import LandingPage from "./app/_landing/LandingPage";
import PlayersPage from "./app/_players/PlayersPage";
import MatchesPage from "./app/_matches/MatchesPage";
import ProfilePage from "./app/_profile/ProfilePage";
import SignUpPage from "./app/_signup/SignUpPage";
import SignInPage from "./app/_signin/SignInPage";
import Navbar from "./components/navbar/Navbar";
import SecuredRoute from "./components/security/SecuredRoute";
import DashboardPage from "./app/_dashboard/DashboardPage";
import ROUTES from "./routes"
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import {
  createMuiTheme,
  ThemeProvider,
} from '@material-ui/core/styles';
import { GlobalStateProvider } from "./functions/globalState";
import { AuthProvider } from "./components/security/AuthProvider";
import PlayerRequestPage from "./app/_admin/_playerRequest/PlayerRequestPage";


declare module '@material-ui/core/styles/createMuiTheme' {
  interface Theme {
    status: {
      danger: string;
    };
  }
  // allow configuration using `createMuiTheme`
  interface ThemeOptions {
    status?: {
      danger?: string;
    };
  }
}

const theme = createMuiTheme({
});

const App: React.FC = () => {
  return <GlobalStateProvider>
      <AuthProvider>
        <SubApp />
      </AuthProvider>
  </GlobalStateProvider>
}

const SubApp: React.FC = () => {
  return (
    <>
      <ThemeProvider theme={theme}>
        <Router>
          <Navbar>
            <>
              <Switch>
                <Route exact path={ROUTES.LANDING} component={LandingPage} />
                <Route exact path={ROUTES.SIGN_UP} component={SignUpPage} />
                <Route exact path={ROUTES.SIGN_IN} component={SignInPage} />

                <Route exact path={ROUTES.DASHBOARD} component={DashboardPage} />
                <Route exact path={ROUTES.PLAYERS} component={PlayersPage} />
                <Route exact path={ROUTES.MATCHES} component={MatchesPage} />

                <SecuredRoute exact path={ROUTES.ADMIN_PLAYERREQUEST} component={PlayerRequestPage} needsSuperadmin />
                <SecuredRoute exact path={ROUTES.PROFILE} component={ProfilePage} />
              </Switch>
            </>
          </Navbar>
        </Router>
      </ThemeProvider>
    </>
  );
};

export default App;
