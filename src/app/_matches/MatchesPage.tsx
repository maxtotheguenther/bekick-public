import * as React from "react";
import { RouteComponentProps } from "react-router-dom";
import { useCollection } from "../../firebase/db/useSnapshot";
import Player from "../../models/Player";
import { playerCollection } from "../../firebase/db/playerDB";

const MatchesPage: React.FC = () => {
    const  [players] = useCollection<Player>(playerCollection)
    console.log("PLAYERS", players)
    return <>
        <h1>MatchesPage</h1>
    </>
};

export default MatchesPage;
