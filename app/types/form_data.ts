export interface LoginForm {
    email: string;
    password: string;
}

export interface SignupForm {
    fullName: string;
    email: string;
    password: string;
}

export interface ResetPasswordForm {
    email: string,
    otp: string,
    newPassword: string,
    confirmedNewPassword: string,
}