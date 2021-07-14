import { User } from "../entities/user.entity";

export class PaginatedResultDto{
    data: User[];
    pageNumber: number;
    pageSize: number;
    totalRecords: number;
}