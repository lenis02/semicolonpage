import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Client } from './entities/client.entity';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';

@Injectable()
export class ClientService {
  constructor(
    @InjectRepository(Client)
    private clientRepository: Repository<Client>
  ) {}

  async create(createClientDto: CreateClientDto, userId: number) {
    const newClient = this.clientRepository.create({
      ...createClientDto,
      user: { id: userId } as User,
    });
    return await this.clientRepository.insert(newClient);
  }

  async findAll(userId: number) {
    return await this.clientRepository.find({
      where: { user: { id: userId } },
      order: { id: 'DESC' },
    });
  }

  // 특정 클라이언트 조회 (클라이언트 수정 조건 확인)
  async findOne(id: number, userId: number) {
    const client = await this.clientRepository.findOne({
      where: { id, user: { id: userId } },
    });

    if (!client) {
      throw new NotFoundException(
        `해당 클라이언트(ID: ${id})를 찾을 수 없거나 권한이 없습니다.`
      );
    }
    return client;
  }

  async update(id: number, updateClientDto: UpdateClientDto, userId: number) {
    const client = await this.findOne(id, userId);

    const updatedClient = Object.assign(client, updateClientDto);
    return await this.clientRepository.save(updatedClient);
  }

  async remove(id: number, userId: number) {
    const client = await this.findOne(id, userId);
    await this.clientRepository.remove(client);
    return { massage: `클라이언트(ID: ${id})가 성공적으로 삭제되었습니다.` };
  }
}
