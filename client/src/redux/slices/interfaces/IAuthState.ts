import { UserProfile } from "./IUserProfile";
import { IMessage } from "./IMessage";

export interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  user: UserProfile | null;
  error: string | null;
  messages: IMessage[];
  privateMessages: IMessage[];
  notifications: [];
}
