import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) {}

  async findBySocialIdOrSave(
    name: string,
    socialId: string,
    provider: string
  ): Promise<User> {
    let user = await this.userRepository.findOne({
      where: { socialId, provider },
    });

    if (!user) {
      user = await this.userRepository.save(
        this.userRepository.create({
          name,
          socialId,
          provider,
        })
      );
    }
    return user;
  }

  async findById(id: number): Promise<User | null> {
    return this.userRepository.findOne({
      where: { id },
    });
  }

  async updateRefreshToken(
    socialId: string,
    provider: string,
    refreshToken: string | null
  ): Promise<void> {
    await this.userRepository.update({ socialId, provider }, { refreshToken });
  }

  async createUser(dto: CreateUserDto): Promise<User> {
    return this.userRepository.save(
      this.userRepository.create({
        name: dto.name,
        socialId: dto.socialId,
        provider: dto.provider,
      })
    );
  }
}
