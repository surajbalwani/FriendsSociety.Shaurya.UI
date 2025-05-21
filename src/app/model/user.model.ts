export interface User {
  userID: number;
  roleID: number;
  role: any | null;
  name: string;
  age: number;
  abilityTypeID: number;
  abilityType: any | null;
  organizationID: number;
  organization: any | null;
  contact: string;
  isDeleted: boolean;
}
