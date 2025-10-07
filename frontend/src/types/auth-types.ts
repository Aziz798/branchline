export type SignupFormType = {
    name: string;
    email: string;
    password: string;
    confirm_password: string;
};

export type SignupFormErrorsType =
    | {
        name?: { errors: string[] };
        email?: { errors: string[] };
        password?: { errors: string[] };
        confirm_password?: { errors: string[] };
    }
    | undefined;
