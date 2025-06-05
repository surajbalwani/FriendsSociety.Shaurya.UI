export interface Organization {
    organizationID: number;
    name: string;
    contact: string;
    isDeleted: boolean;
    users: any[];
}
