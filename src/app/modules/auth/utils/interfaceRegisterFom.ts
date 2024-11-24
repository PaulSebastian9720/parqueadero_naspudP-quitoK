import { FormControl } from "@angular/forms";


export interface IUsernAuth {
    name : FormControl<string | null>;
    last_name : FormControl<string | null>;
    correo: FormControl<string | null>;
    password : FormControl<string | null>;
    confirmPassword : FormControl<string | null>;
    birthday  : FormControl<Date | string | null>;
}

export interface IUserSingIn {
    correo: FormControl<string | null>;
    password : FormControl<string | null>;
}


export interface IUser {
    correo : string;
    password : string;
}