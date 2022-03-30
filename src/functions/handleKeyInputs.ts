import Match from "../models/Match"
import IGeneric from "../models/GenericModel"
import { updateActiceGame } from "../firebase/db/dashboardDB"

// Handle Key Inputs for regular match
export const handleRegularKeyInputs = (key: string, match: IGeneric<Match>, onBackspace: () => void) => {
    if (key === "1")
        if (!(match.data.goalsBlack === 5 && match.data.goalsWhite === 4))
            if (match.data.goalsWhite !== 5)
                updateActiceGame({ goalsWhite: match.data.goalsWhite + 1 })
    if (key === "2")
        if (!(match.data.goalsWhite === 5 && match.data.goalsBlack === 4))
            if (match.data.goalsBlack !== 5)
                updateActiceGame({ goalsBlack: match.data.goalsBlack + 1 })
    if (key === "q")
        if (match.data.goalsWhite !== 0)
            updateActiceGame({ goalsWhite: match.data.goalsWhite - 1 })
    if (key === "w")
        if (match.data.goalsBlack !== 0)
            updateActiceGame({ goalsBlack: match.data.goalsBlack - 1 })
    if (key === "backspace")
        onBackspace()

}