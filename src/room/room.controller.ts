import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RoomService } from './room.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { InvitationDto } from './dto/invitation.dto';
import { CreateOpenaiDto } from 'src/openai/dto/create-openai.dto';

@Controller('room')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Post()
  create(@Body() createRoomDto: CreateRoomDto) {
    return this.roomService.create(createRoomDto);
  }

  @Get()
  findAll() {
    return this.roomService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.roomService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRoomDto: UpdateRoomDto) {
    return this.roomService.update(+id, updateRoomDto);
  }
  
  @Patch(':id/save-diagram')
  updateDiagram(@Param('id') id: string, @Body() diagram: any) {
    return this.roomService.updateDiagram(+id, diagram.content);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.roomService.remove(+id);
  }

  @Post('invitation')
  async findByInvitationToken(@Body() invitationDto: InvitationDto){
    return await this.roomService.findByInvitationToken(invitationDto);
  }

  @Get(':id/export-diagram')
  async exportDiagram(@Param('id') id: string){
    return await this.roomService.exportDiagramToXMI(+id);
  }

  @Get(':id/code')
  async generateCodeFromDiagram(@Param('id') id: number, @Body() generateCodeDto: CreateOpenaiDto){
    return await this.roomService.generateCodeFromDiagram(id, generateCodeDto);
  }
}
