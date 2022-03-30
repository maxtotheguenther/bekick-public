import React from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import CssBaseline from "@material-ui/core/CssBaseline";
import useScrollTrigger from "@material-ui/core/useScrollTrigger";
import Container from "@material-ui/core/Container";
import Slide from "@material-ui/core/Slide";
import MailIcon from "@material-ui/icons/Mail";
import NotificationsIcon from "@material-ui/icons/Notifications";
import PersonIcon from "@material-ui/icons/Person";
import IconButton from "@material-ui/core/IconButton";
import Badge from "@material-ui/core/Badge";
import Button from "@material-ui/core/Button";
import ROUTES from "../../routes";
import { Link, useHistory } from "react-router-dom";
import { auth } from "../../firebase/firebase";
import { successNotification, errorNotification } from "../../functions/notifications";
import { useAuthCtx } from "../security/AuthProvider";
import { makeStyles, createStyles } from "@material-ui/core/styles";

interface NavBarProps {
  children: React.ReactElement;
}

export default function NavBar(props: NavBarProps) {
  const classes = makeAppBarStyles();
  const { signedInUser, anonymousUser, authCtx } = useAuthCtx();
  const history = useHistory();
  
  const signOut = () => {
    // we got a user so sign him out
    if (authCtx.user) {
      auth.signOut()
        .then(() => {
          successNotification(`See you!`)
          history.push(ROUTES.LANDING)
        })
        .catch(err => {
          console.error(err)
          errorNotification("Whoops. Something went wrong")
        })
    }

  }
  const menuEntries: Array<{
    title: string;
    className: string;
    link: string;
  }> = [
      {
        title: "Dashboard",
        className: classes.title,
        link: ROUTES.DASHBOARD
      },
      {
        title: "Players",
        className: classes.title,
        link: ROUTES.PLAYERS
      },
      {
        title: "Matches",
        className: classes.title,
        link: ROUTES.MATCHES
      },
      {
        title: "Statistics",
        className: classes.title,
        link: "statistics"
      }
    ];

  const renderAnonymousIcons = (
    <>
      <Button>
        <Typography className={classes.title}>
          <Link to="/sign-in">Sign In</Link>
        </Typography>
      </Button>
      <Button color="primary">
        <Typography className={classes.title}>
          <Link to="/sign-up">Sign Up</Link>
        </Typography>
      </Button>
    </>
  );

  const renderProfileIcons = (
    <>
      <IconButton aria-label="show 4 new mails" color="inherit">
        <Badge badgeContent={4} color="secondary">
          <MailIcon className={classes.icons} />
        </Badge>
      </IconButton>
      <IconButton aria-label="show 17 new notifications" color="inherit">
        <Badge badgeContent={17} color="secondary">
          <PersonIcon className={classes.icons} />
        </Badge>
      </IconButton>
      <Button color="primary" onClick={() => signOut()}>
        <Typography className={classes.title}>
          <Link to="/sign-up">Sign Out</Link>
        </Typography>
      </Button>
    </>
  );

  return (
    <React.Fragment>
      <CssBaseline />
      <HideOnScroll {...props}>
        <AppBar className={classes.appBar}>
          <Toolbar>
            <Typography variant="h6" className={classes.brand}>
              BAC
            </Typography>
            {menuEntries.map(entry => (
              <Typography key={entry.link} className={entry.className}>
                <Link to={entry.link}>{entry.title}</Link>
              </Typography>
            ))}
            {anonymousUser && renderAnonymousIcons}
            {signedInUser && renderProfileIcons}
          </Toolbar>
        </AppBar>
      </HideOnScroll>
      <Toolbar /> {/**SPACER*/}
      <Container>{props.children}</Container>
    </React.Fragment>
  );
}

const makeAppBarStyles = makeStyles(theme =>
  createStyles({
    appBar: {
      backgroundColor: "white"
    },
    brand: {
      color: "black",
      flexGrow: 3
    },
    title: {
      color: "black",
      flexGrow: 1,
      "&:hover": {
        color: "green"
      }
    },
    icons: {
      color: "black"
    }
  })
);

function HideOnScroll(props: { children: React.ReactElement }) {
  const { children } = props;
  const trigger = useScrollTrigger({ target: undefined });
  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}
