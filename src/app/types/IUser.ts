export interface IUser {
    id: string;
    username: string;
    password: string;
    email?: string;
    firstName?: string;
    lastName?: string;
    birthday?: string;
    role?: string;
    profile?: [];
    matchListId?: [];
}