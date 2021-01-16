import React, { useState } from "react";
import PropTypes from "prop-types";
import { AuthLayout } from "./../components";
import { SendRestEmailForm, ResetPasswordForm } from "./components";

const ForgotPassword = (props) => {
  const { authData, onAuthStateChange } = props;
  const { email: username } = authData || {};
  const [state, setState] = useState({ emailed: false, username });

  const handleOnSentEmail = React.useCallback((username) => {
    setState({ emailed: true, username });
  }, []);

  const handleTryAgain = React.useCallback(
    () => setState({ ...state, emailed: false }),
    [state]
  );

  return (
    <AuthLayout>
      {!state.emailed ? (
        <SendRestEmailForm
          email={state.username}
          onSentEmail={handleOnSentEmail}
          onAuthStateChange={onAuthStateChange}
        />
      ) : (
        <ResetPasswordForm
          username={state.username}
          onTryAgain={handleTryAgain}
        />
      )}
    </AuthLayout>
  );
};

ForgotPassword.propTypes = {
  authData: PropTypes.object,
  onAuthStateChange: PropTypes.func.isRequired,
};

export default ForgotPassword;
