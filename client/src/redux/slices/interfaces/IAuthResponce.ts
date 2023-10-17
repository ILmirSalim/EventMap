import { UserProfile } from "./IUserProfile";

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: UserProfile;
}
