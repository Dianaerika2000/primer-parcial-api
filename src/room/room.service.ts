import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { Room } from './entities/room.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserService } from 'src/user/user.service';

@Injectable()
export class RoomService {

  constructor(
    @InjectRepository(Room)
    private readonly roomRepository: Repository<Room>,

    private readonly userService: UserService,
  ) {}

  async create(createRoomDto: CreateRoomDto) {
    const {ownerId, ...data} = createRoomDto;

    const user = await this.userService.findOneById(ownerId);

    const randomNumber = this.generateRandomNumber().toString();

    const room = this.roomRepository.create(
      {
        ...data,
        invitation_token: randomNumber,
        owner: user,
      }
    );

    return await this.roomRepository.save(room);
  }

  async findAll() {
    return await this.roomRepository.find();
  }

  async findOne(id: number) {
    const room = await this.roomRepository.findOneBy({id: id});

    if(!room){
      throw new NotFoundException(`Room with id ${id} not found`);
    }

    return room;
  }

  update(id: number, updateRoomDto: any) {
    const room = this.findOne(id);

  }

  async updateDiagram(id: number, diagram: string) {
    const room = await this.findOne(id);

    room.diagram = diagram;

    const updatedRoom = {
      ...room,
      diagram: diagram,
    };

    return await this.roomRepository.save(updatedRoom);
  }

  remove(id: number) {
    return `This action removes a #${id} room`;
  }

  generateRandomNumber() {
    const min = 1000; // Mínimo de 4 dígitos (1000)
    const max = 9999; // Máximo de 4 dígitos (9999)

    // Generar un número aleatorio entre min y max
    const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;

    return randomNumber;
  }
}
