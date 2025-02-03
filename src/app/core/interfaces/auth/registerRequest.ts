import { User } from "../person";
import { Credential } from "./credential";

export interface AuthRequest {
    credentials: Credential,
    user: User
}