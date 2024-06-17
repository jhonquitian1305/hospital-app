
export class ResponsePaginatedDto<T> {
    elements: T[];

    totalElements: number;
    
    limit: number;
  
    offset: number;  
}