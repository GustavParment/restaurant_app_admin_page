export interface IAdminProfile {
    avatar: string;
    bio: string;
    favoriteFood: string[];
    hobbies: string[];

}

export interface IAdmin {
    username: string,
    password: string,
    email: string,
    firstName: string,
    lastName: string,
    birthday: string,
    profile: IAdminProfile[]

}