import * as React from "react";
import * as Yup from "yup";
import Button from "@material-ui/core/Button";
import Player from "../../models/Player";
import { storage } from "../../firebase/firebase";
import { Formik, Form } from "formik";
import { TextFieldF } from "../../components/formElements/TextField";
import { playerCollection, updatePlayer } from "../../firebase/db/playerDB";
import { useUser } from "../../components/security/AuthProvider";
import { successNotification, errorNotification } from "../../functions/notifications";
import { useDocument } from "../../firebase/db/useSnapshot";

const ProfilePage: React.FC = () => {
  const [avatarUrl, setAvatarUrl] = React.useState<string | null>(null);
  const { user: { uid } } = useUser();
  const [player] = useDocument<Player>(playerCollection.doc(uid))

  // Update single player with new values
  const updateProfile = (updatedPlayer: Player) => {
    updatePlayer(uid, updatedPlayer)
    .then(() => successNotification(`Successfully updated your profile Mister!`))
    .catch((err: Error) => {
      console.error(err)
      errorNotification(`Could not update your profile.`)
    })
  }

  // Upload avatar to firebase storage
  const uploadAvatar = (files: FileList | null, callback: (url: string) => void) => {
    if (files && files.item(0)) {
      const file = files.item(0);
      if (file) {
        storage
          .ref()
          .child(uid)
          .put(file)
          .then(snapshot => snapshot.ref.getDownloadURL())
          .then(url => {
            setAvatarUrl(url as string)
            callback(url as string)
          });
      }
    }
  };
  if (!player) return null

  const avatarUrlToUse = avatarUrl ? avatarUrl : player.data.avatar
  return (
    <Formik
      initialValues={player.data}
      validationSchema={ProfileFormSchema}
      onSubmit={updateProfile}
    >
      {formik => {
        return (
          <Form>
            <TextFieldF label="last name" name="lastName" />
            <TextFieldF label="first name" name="firstName" />
            <TextFieldF label="alias" name="alias" />
            <TextFieldF label="email" name="email" />
            <input
              accept="image/x-png,image/gif,image/jpeg"
              type="file"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                uploadAvatar(e.target.files, (url: string) => formik.setFieldValue("avatar", url))
              }
            />
            <img alt="usersavatar" src={avatarUrlToUse} style={{width: "200px"}}/>
            <Button type="submit" variant="contained">
              Profil updaten
            </Button>
          </Form>
        );
      }}
    </Formik>
  );
};

export default ProfilePage;

// Form validation declaration
const ProfileFormSchema = Yup.object().shape({
  lastName: Yup.string().required("Required"),
  firstName: Yup.string().required("Required"),
  alias: Yup.string().required("Required"),
  email: Yup.string()
    .email("Provide valid email")
    .required("Required")
});
