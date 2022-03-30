import * as React from "react";
import Player from "../../models/Player";
import Match from "../../models/Match";
import Select from 'react-select'
import IGeneric from "../../models/GenericModel";
import Hotkeys from 'react-hot-keys';
import { useCollection, useDocument } from "../../firebase/db/useSnapshot";
import { playerCollection } from "../../firebase/db/playerDB";
import { setInitMatch, dashboardCollection, ACTIVE_GAME, MATCH_FIELDS, updateActiceGame } from "../../firebase/db/dashboardDB";
import { handleRegularKeyInputs } from "../../functions/handleKeyInputs";

const DashboardPage: React.FC = () => {
    const [players] = useCollection<Player>(playerCollection)
    const [match] = useDocument<Match>(dashboardCollection.doc(ACTIVE_GAME))
    const playerSelectElement = React.useRef<Select<any>>(null) // create Ref to focus and blur playerSelect
    React.useEffect(() => {setInitMatch()}, [])

    if (!players || !match) return null

    const {
        data: { keeperWhite, keeperBlack, strikerBlack, strikerWhite, goalsBlack, goalsWhite }
    } = match

    // Get all players by selected match player uid's
    const selectedPlayers: SelectedPlayers = {
        keeperWhite: players.filter(p => p.uid === keeperWhite)[0],
        strikerWhite: players.filter(p => p.uid === strikerWhite)[0],
        keeperBlack: players.filter(p => p.uid === keeperBlack)[0],
        strikerBlack: players.filter(p => p.uid === strikerBlack)[0],
    }

    // Assembel opt by uid and player
    const getPlayerOpt = (uid: string, player: IGeneric<Player>) =>
        uid === "" ? [] : [{ value: uid, label: player.data.email, player }]

    // Spread all options to one array.
    const selectedOptions = [
        ...getPlayerOpt(keeperWhite, selectedPlayers.keeperWhite),
        ...getPlayerOpt(strikerWhite, selectedPlayers.strikerWhite),
        ...getPlayerOpt(keeperBlack, selectedPlayers.keeperBlack),
        ...getPlayerOpt(strikerBlack, selectedPlayers.strikerBlack)
    ] as SelectOption[]

    // assemble available player options
    const options: SelectOption[] = players.map(player => ({
        value: player.uid,
        label: player.data.email,
        player
    }))

    // Set each selected player to dashboard activegame
    const setPlayer = (selectedPlayers: SelectOption[]) => {
        // Blur playerSelect when all playsers are selected
        if (selectedPlayers.length === 4)
            playerSelectElement &&
                playerSelectElement.current &&
                playerSelectElement.current.blur()
        const playerDefaults = 4 - selectedPlayers.length
        const defaultPlayers = Array(playerDefaults).fill({ value: "" })
        const playersToSet = [...selectedPlayers, ...defaultPlayers].reduce<{ [key: string]: string }>((result, item, index) => {
            const position = getTextOrPositionByPlayersIndex(index)
            result[position] = item.value;
            return result;
        }, {})
        updateActiceGame(playersToSet)
    }

    const getPlayer = (player: IGeneric<Player>) => <> {player && <>{player.uid} {player.data.email}</>}</>

    const cancelMatch = () =>
        setInitMatch()

    const endMatch = () => {
        alert("Hello")
        // Create match

        // Determine if theirs a deathmatch
    }

    return (<>
        <Select
            ref={playerSelectElement}
            autoFocus={true}
            openMenuOnFocus={true}
            value={selectedOptions}
            placeholder={getLabel(selectedOptions.length)}
            options={selectedOptions.length < 4 ? options : []} // prevent user selection of more than 4
            isMulti
            onChange={(selectedPlayers) =>
                setPlayer(selectedPlayers as SelectOption[] || [])
            }
        />
        <Hotkeys
            keyName="1,2,q,w,backspace"
            onKeyUp={(key) =>
                handleRegularKeyInputs(key, match, () => playerSelectElement &&
                playerSelectElement.current &&
                playerSelectElement.current.focus())
            }
            allowRepeat={false}
        >
            <div>
                <h1>Regular match</h1>
                <h4>White keeper {getPlayer(selectedPlayers.keeperWhite)}</h4>
                <h4>White striker {getPlayer(selectedPlayers.strikerWhite)}</h4>
                <h4>Goals White {match.data.goalsWhite}</h4>
                <h4>Goals Black {match.data.goalsBlack}</h4>
                <h4>Black keeper {getPlayer(selectedPlayers.keeperBlack)}</h4>
                <h4>Black striker {getPlayer(selectedPlayers.strikerBlack)}</h4>
                <h4>Deathmatch {match.data.deathmatch ? "Ja" : "Nein"}</h4>
                <h4>Rookie {match.data.rookiegame ? "Ja" : "Nein"}</h4>
                {(goalsWhite === 5 || goalsBlack === 5) && 
                    <button onClick={() => endMatch()} autoFocus style={{ color: "red" }}>Finish match</button>
                }
                <button onClick={() => cancelMatch()}>Cancel match</button>
            </div>
        </Hotkeys>
        <div>
            <h1>Deathmatch</h1>
        </div>
        <div><h1>Deathmatch Rookiestyle</h1></div>
    </>
    );
};

export default DashboardPage;

const getLabel = (i: number) => getTextOrPositionByPlayersIndex(
    i, "Choose white keeper", "Choose white striker", "Choose black keeper", "Choose black striker"
)

// Either return given text or player position
const getTextOrPositionByPlayersIndex = (length: number, kW?: string, sW?: string, kB?: string, sB?: string) => {
    if (length === 0) return kW || MATCH_FIELDS.KEEPER_WHITE
    if (length === 1) return sW || MATCH_FIELDS.STRIKER_WHITE
    if (length === 2) return kB || MATCH_FIELDS.KEEPER_BLACK
    if (length === 3) return sB || MATCH_FIELDS.STRIKER_BLACK
    return ""
}   

interface SelectOption {
    value: string,
    label: string,
    player: IGeneric<Player>
}

interface SelectedPlayers {
    keeperWhite: IGeneric<Player>,
    strikerWhite: IGeneric<Player>,
    keeperBlack: IGeneric<Player>,
    strikerBlack: IGeneric<Player>,
}