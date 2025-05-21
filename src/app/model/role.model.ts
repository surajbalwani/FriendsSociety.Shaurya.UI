export interface Role {
  roleID: number;
  name: string;
  permissions: string;
  users: any[]; // You can replace 'any' with a User[] if you want to strongly type it
}
