export interface UserProfile {
  email: string;
  _id?: string | undefined;
  password?: string;
  userName: string;
  userAge?: string;
  interestsAndPreferences?: string;
  avatar?: undefined | string;
  
}

export interface IUserProfile {
  email: string;
  _id?: string | undefined;
  password?: string;
  userName?: string;
  userAge?: string;
  interestsAndPreferences?: string;
  avatar?: undefined | string;
  
}