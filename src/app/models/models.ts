// User (AspNetUsers - Identity)
export interface User {
  id: string;
  userName: string;
  email?: string;
  age: number;
  bloodGroup?: string;
  address?: string;
  contactNo?: string;
  whatsappNumber?: string;
  organizationID: number;
  organizationName?: string;
  abilityTypeID: number;
  abilityTypeName?: string;
  isDeleted: boolean;
  createdDate?: string;
}

export interface UserCreate {
  userName: string;
  email?: string;
  password: string;
  age: number;
  bloodGroup?: string;
  address?: string;
  contactNo?: string;
  whatsappNumber?: string;
  organizationID: number;
  abilityTypeID: number;
}

export interface Role {
  id: string; // Identity Role uses string ID
  roleID?: number; // For compatibility with old code
  name: string;
  normalizedName?: string;
  concurrencyStamp?: string;
  permissions?: string; // For additional permissions
}

export interface AbilityType {
  abilityTypeID: number;
  name: string;
  description?: string;
  isDeleted: boolean;
}

export interface Organization {
  organizationID: number;
  name: string;
  contact?: string;
  isDeleted: boolean;
}

export interface Activity {
  activityID: number;
  name: string;
  rules?: string;
  isDeleted: boolean;
}

export interface ActivityCategory {
  activityCategoryID: number;
  activityID: number;
  activity?: Activity;
  abilityTypeID: number;
  abilityType?: AbilityType;
  exclusionType?: string;
}

export interface Ground {
  groundID: number;
  name: string;
  location?: string;
}

export interface GroundAllocation {
  groundAllocationID: number;
  groundID: number;
  ground?: Ground;
  activityID: number;
  activity?: Activity;
  startTime: string;
  endTime: string;
}

export interface Participant {
  participantID: number;
  name: string;
  age: number;
  gender?: string;
  bloodGroup?: string;
  organizationID: number;
  organizationName?: string;
  abilityTypeID: number;
  abilityTypeName?: string;
  contact?: string;
  emergencyContact?: string;
  address?: string;
  medicalNotes?: string;
  isDeleted: boolean;
  createdDate?: string;
  updatedDate?: string;
}

export interface Volunteer {
  volunteerID: number;
  name: string;
  age: number;
  bloodGroup?: string;
  contact?: string;
  whatsAppNo?: string;
  email?: string;
  address?: string;
  isDeleted: boolean;
  createdDate?: string;
  updatedDate?: string;
}

export interface TeamAssignment {
  teamAssignmentID: number;
  teamName: string;
  leaderID: number; // Volunteer ID
  leaderName?: string;
  memberIDs?: string;
  groundID?: number;
  groundName?: string;
  createdDate?: string;
  isDeleted: boolean;
}

export interface TeamMemberDetails {
  teamAssignmentID: number;
  teamName: string;
  leaderID: number;
  leaderName: string;
  members: TeamMember[];
  memberCount: number;
  groundID?: number;
  groundName?: string;
  createdDate: string;
}

export interface TeamMember {
  volunteerID: number;
  name: string;
  contact?: string;
}
