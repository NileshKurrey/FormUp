enum Status {
  Active = 'active',
  Disabled = 'disabled',
}
export class Group {
  constructor(
    public name: string,
    public description: string | null,
    public status: Status,
    public createdAt: Date,
    public disbandAt: Date | null,
    public softDeleted: boolean,
    public leaderId: string,
    public cohortId: string,
    public applicationExpiry: string | null,
    public members: string[],
    public posts: string[] | null,
    public applications: string[] | null,
    public auditlogs: string[],
    public id?: string
  ) {}
}

export class Applications {
  constructor(
    public title: string,
    public description: string,
    public applicantId: string,
    public groupId: string,
    public metaData: string | null,
    public profileLinks: string[] | null,
    public status: string,
    public requestedAt: Date,
    public updatedAt: Date,
    public approvedAt?: Date,
    public withdrawnAt?: Date,
    public rejectedAt?: Date,
    public id?: string
  ) {}
}
