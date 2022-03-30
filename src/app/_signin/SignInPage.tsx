import * as React from "react";
import * as Yup from "yup";
import Button from "@material-ui/core/Button";
import ROUTES from "../../routes";
import { Formik, Form } from "formik";
import { TextFieldF } from "../../components/formElements/TextField";
import {
  successNotification,
  errorNotification
} from "../../functions/notifications";
import { useHistory } from "react-router";
import SocialLogin from "../../components/forms/SocialLogin";
import { doSignInWithEmailAndPassword } from "../../firebase/auth/auth";

export default function SignInPage() {
  const history = useHistory();
  return (
    <Formik
      initialValues={initValues}
      validationSchema={SignInSignUpValidationSchema}
      onSubmit={({email, password}) => 
        doSignInWithEmailAndPassword({email, password})
        .then(() => {
          history.push(ROUTES.PROFILE);
          successNotification(`Welcome back!`);
        })
        .catch((err: Error) => {
          console.error(err);
          const msg = err as { message: string }
          errorNotification(msg.message);
        })
      }
    >
      {() => {
        return (
          <Form>
            <TextFieldF label="Email" name="email" />
            <TextFieldF type="password" label="Password" name="password" />
            <Button type="submit" variant="contained">
              Sign in
            </Button>
            <SocialLogin />
          </Form>
        );
      }}
    </Formik>
  );
}

interface SignInSignUpValues {
  email: string;
  password: string;
}

const initValues: SignInSignUpValues = {
  email: "",
  password: ""
};

const SignInSignUpValidationSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email")
    .required("Required"),
  password: Yup.string()
    .required("No password provided.")
    .min(8, "Password is too short - should be 8 chars minimum.")
});
