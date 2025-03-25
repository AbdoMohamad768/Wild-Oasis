import SignupForm from "../features/authentication/SignupForm";
import Heading from "../ui/Heading";

function NewUsers() {
  return (
    <>
      <Heading $type="h1">Create a new user</Heading>

      <SignupForm />
    </>
  );
}

export default NewUsers;
