export class Cohorts {
  constructor(
    public name: string,
    public duration: number,
    public createdAt: Date,
    public updataedAt: Date,
    public description: string | null,
    public startDate: Date,
    public endDate: Date,
    public moderators?: string[],
    public students?: string[],
    public groups?: string[],
    public seedData?: string[],
    public id?: string
  ) {}
}
