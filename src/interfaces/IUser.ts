export interface IUser {
  id: string;
  firstName: string;
  lastName: string;
  gender: string;
}

export type IUpdateUser = Omit<IUser, "id">;
