import { IsOptional } from 'class-validator';

export class CreateProjectDto {
  title!: string;
  clientId!: number;
  techStack?: string[];
  status?: string;
}
