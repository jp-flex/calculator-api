import { IntegerType } from "@mikro-orm/core";
import { Controller, Delete, Get, HttpCode, NotFoundException, Param,
   ParseIntPipe, Query, Req, Version } from "@nestjs/common";
import { ApiBearerAuth, ApiQuery } from "@nestjs/swagger";
import { GetRecord } from '../dtos/get.record';
import { RecordService } from '../services/record.service';

@ApiBearerAuth()
@Controller('records')
export class RecordController {

  constructor(private readonly recordService: RecordService) {}

  @Version('1')
  @Get('/')
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'operation', required: false, type: String })
  @ApiQuery({ name: 'amount', required: false, type: String })
  @ApiQuery({ name: 'operationResponse', required: false, type: String })
  @ApiQuery({ name: 'userBalance', required: false, type: String })
  async getRecords(
        @Req() req,
        @Query('page') page?: number,
        @Query('limit') limit?: number,
        @Query('operation') operation?: string,
        @Query('amount') amount?: string,
        @Query('operationResponse') operationResponse?: string,
        @Query('userBalance') userBalance?: string,
  ) : Promise<{ records: GetRecord[]; total: number }> {
    const paginationOptions = {
      page: page || 1,
      limit: limit || 10,
    };
        
    const filter = {
      type: operation || "",
      amount: amount || "",
      operation_response: operationResponse || "",
      user_balance: userBalance || ""
    }
    const {records, total} = await this.recordService
      .getRecords(req.user.id, paginationOptions, filter);

    const mappedRecords = records.map( record => ({
      id: record.id,
      userId: record.user_id,
      amount: record.amount,
      operation: record.operation,
      operationResponse: record.operation_response,
      userBalance: record.user_balance,
      deletedAt: record.deleted_at,
      createdAt: record.created_at
    }))

    return {records: mappedRecords, total};
  }

  @Version('1')
  @Delete(':id')
  @HttpCode(204)
  async deleteRecord(
      @Param('id', ParseIntPipe) id: number
  ) {
    try {
      await this.recordService.softDeleteRecord(id)
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }
}