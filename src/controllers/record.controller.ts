import { Controller, Delete, Get, NotFoundException, Param, ParseIntPipe, Query, Req, UseGuards } from "@nestjs/common";
import { Record } from "src/entities/record.entity";
import { JwtMiddleware } from "src/middlewares/jwt-middeware";
import { RecordService } from "src/services/record.service";

@Controller('records')
@UseGuards(JwtMiddleware)
export class RecordController {

    constructor(private readonly recordService: RecordService) {}

    @Get('/')
    async getRecords(
        @Query('page') page: number,
        @Query('limit') limit: number,
        @Query('operation') operation: string,
        @Query('amount') amount: string,
        @Req() req
    ) : Promise<{ records: Record[]; total: number }> {
        const paginationOptions = {
            page: page || 1,
            limit: limit || 10,
          };
        
        const filter = {
            type: operation || "",
            amount: amount || "",
        }

        return await this.recordService.getRecords(req.user.id, paginationOptions, filter);
    }

    @Delete(':id')
    async deleteRecord(
        @Param('id', ParseIntPipe) id: number
    ) {
        const response =  await this.recordService.softDeleteRecord(id)

        if (!response) 
            throw new NotFoundException(`Not found Record with id: ${id}`);

        return response;
    }

}