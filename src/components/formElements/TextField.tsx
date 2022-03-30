import * as React from "react"
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { default as MaterialTextField } from '@material-ui/core/TextField';
import { useField } from "formik";

interface ITextFieldF {
    type?: string,
    label: string,
    name: string,
    disabled?: boolean
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            margin: theme.spacing(1),
        },
    }),
);

export const TextFieldF = ({
    ...props
}: ITextFieldF) => {
    const [field, meta] = useField(props.name);
    const classes = useStyles();
    return <MaterialTextField
        className={classes.root}
        helperText={meta.error}
        {...meta.error && { error: true }}
        {...props}
        {...field} 
    />
}
