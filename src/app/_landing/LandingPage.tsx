import * as React from "react";
import { RouteComponentProps } from "react-router-dom";

interface LandingPageProps extends RouteComponentProps<any> {
  name: string
}

const LandingPage: React.FC<LandingPageProps> = ({ name }) => {
  return <>
    <h1>LandingPage</h1>
  </>;
};

export default LandingPage;
