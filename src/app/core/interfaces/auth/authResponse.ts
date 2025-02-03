import { User } from "../person";
import { Jwt } from "./jwr";

export interface AuthResponse {
    jwt: Jwt,
    user: User
}