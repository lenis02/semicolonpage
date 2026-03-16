import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { JwtAccessGuard } from '../auth/guard/jwt-access.guard';
import { CurrentUser } from '../auth/decorator/current-user.decorator';

@Controller('task')
@UseGuards(JwtAccessGuard)
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  create(@Body() createTaskDto: CreateTaskDto) {
    return this.taskService.create(createTaskDto);
  }

  // @Get()
  // findAll() {
  //   return this.taskService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.taskService.findOne(+id);
  // }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTaskDto: UpdateTaskDto,
    @CurrentUser('sub') userId: number
  ) {
    return this.taskService.update(id, updateTaskDto, userId);
  }

  @Delete(':id')
  remove(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser('sub') userId: number
  ) {
    return this.taskService.remove(id, userId);
  }
}
