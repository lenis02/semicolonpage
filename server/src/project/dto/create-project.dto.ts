export class CreateProjectDto {
  title!: string;
  clientId!: number;
  techStack?: string[];
  status?: string;
}
