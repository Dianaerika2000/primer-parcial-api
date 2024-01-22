import { Injectable } from '@nestjs/common';
import { CreateOpenaiDto } from './dto/create-openai.dto';
import { UpdateOpenaiDto } from './dto/update-openai.dto';
import OpenAI from 'openai';
import { ConfigService } from '@nestjs/config';
import { RoomService } from '../room/room.service';

@Injectable()
export class OpenaiService {
  constructor(
    private readonly configService: ConfigService,
  ){}

  async generateCodeFromDiagram(createOpenaiDto: CreateOpenaiDto) {
    const { xmlDiagram, programmingLanguage } = createOpenaiDto;

    const prompt = `
      Genera código ${programmingLanguage} orientado a objetos a partir de un diagrama en formato XML.

      Diagrama XML de ejemplo:

      ${xmlDiagram}

      Genera código ${programmingLanguage} que implemente la lógica orientada a objetos representada en el diagrama XML proporcionado.

      Código ${programmingLanguage} resultante:
    `;

    const openai = new OpenAI(this.configService.get('OPENAI_API_KEY'));
    
    
    const gptResponse = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'Estás generando código a partir de un diagrama XML.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.9,
      max_tokens: 2000,
    });

    const code = gptResponse.choices[0].message.content;

    return code;
  }
}
