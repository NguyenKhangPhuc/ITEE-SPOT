import { login } from "../actions/authentication/post/login"
import { resendVerificationCode } from "../actions/authentication/post/resendVerificationCode"
import LoginClient from "./LoginClient"

export default function LoginPage() {
  return (
    <LoginClient
      actions={{
        login,
        resendVerificationCode,
      }}
    />
  )
}