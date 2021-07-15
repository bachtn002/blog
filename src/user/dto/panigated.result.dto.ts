import { User } from "../entities/user.entity";

export class PaginatedResultDto{
    data: User[];
    page: number;
    limit: number;
    totalRecord: number;
}