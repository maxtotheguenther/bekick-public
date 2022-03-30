import * as React from "react";
import * as Yup from "yup";
import Button from "@material-ui/core/Button"
import ROUTES from "../../routes";
import { Formik, Form } from 'formik';
import { doSignUp } from "../../firebase/auth/auth";
import { TextFieldF } from "../../components/formElements/TextField";
import { successNotification, errorNotification } from "../../functions/notifications";
import { useHistory } from "react-router";
import SocialLogin from "../../components/forms/SocialLogin";

export default function SignUpPage() {
    const history = useHistory();
    return <Formik
        initialValues={initValues}
        validationSchema={SignUpValidationSchema}
        onSubmit={({ email, password }) => {
            doSignUp({ email, password })
            .then(() => {
                history.push(ROUTES.PROFILE)
                successNotification(`Welcome at Bekick!`)
            })
            .catch((err: Error) => {
                console.error(err)
                const msg = err as { message: string }
                errorNotification(msg.message);
            })
        }}
    >
        {() => {
            return (
                <Form>
                    <TextFieldF label="Email" name="email" />
                    <TextFieldF type="password" label="Password" name="password" />
                    <Button type="submit" variant="contained">Registrieren</Button>
                    <SocialLogin />
                </Form>
            )
        }}
    </Formik>
}

// Form value decleration
interface SignUpPageValues {
    email: string,
    password: string
}

const initValues: SignUpPageValues = {
    email: "",
    password: ""
}

// Form validation schema
const SignUpValidationSchema = Yup.object().shape({
    email: Yup.string()
        .email('Invalid email')
        .required('Required'),
    password: Yup.string()
        .required('No password provided.')
        .min(8, 'Password is too short - should be 8 chars minimum.')
})