
export class User {
    firstName: string;
    lastName: string;
    organizationCode: string;
    branchCode: string;
    email: string;
    roles: string[];
    sp: boolean;
    allowedBranches: string[];
    sendEmailOnCreate: boolean;
    isInsurerUser: boolean;
}
