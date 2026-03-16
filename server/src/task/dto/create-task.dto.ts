export class CreateTaskDto {
  content!: string;
  projectId!: number;
  dueDate?: Date;
}
