import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { OpenaiService } from './openai.service';
import { CreateOpenaiDto } from './dto/create-openai.dto';

@Controller('openai')
export class OpenaiController {
  constructor(private readonly openaiService: OpenaiService) {}

  // @Post()
  // create(@Body() createOpenaiDto: CreateOpenaiDto) {
  //   return this.openaiService.create(createOpenaiDto);
  // }

  @Post('code')
  getCode(@Body() createOpenaiDto: CreateOpenaiDto) {
    return this.openaiService.generateCodeFromDiagram(createOpenaiDto);
  }
}
