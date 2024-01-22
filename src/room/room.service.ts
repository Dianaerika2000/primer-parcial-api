import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { Room } from './entities/room.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserService } from 'src/user/user.service';
import { InvitationDto } from './dto/invitation.dto';
import { parseString } from 'xml2js';
import { OpenaiService } from 'src/openai/openai.service';
import { CreateOpenaiDto } from 'src/openai/dto/create-openai.dto';

@Injectable()
export class RoomService {
  constructor(
    @InjectRepository(Room)
    private readonly roomRepository: Repository<Room>,

    private readonly userService: UserService,

    private readonly openaiService: OpenaiService,
  ) {}

  private xmlEncabezado = `<?xml version="1.0" encoding="windows-1252" standalone="no" ?>
  <XMI xmi.version="1.1" xmlns:UML="omg.org/UML1.3" timestamp="2023-10-15 04:42:08">
    <XMI.header>
      <XMI.documentation>
        <XMI.exporter>Enterprise Architect</XMI.exporter>
        <XMI.exporterVersion>2.5</XMI.exporterVersion>
      </XMI.documentation>
    </XMI.header>
    <XMI.content>
      <UML:Model name="EA Model" xmi.id="MX_EAID_6ECAC6CF_8466_408f_8CB1_C435C8B39344">
        <UML:Namespace.ownedElement>
          <UML:Class name="EARootClass" xmi.id="EAID_11111111_5487_4080_A7F4_41526CB0AA00" isRoot="true" isLeaf="false" isAbstract="false"/>
          
          <UML:Package name="diagrama-secuencia" xmi.id="EAPK_6ECAC6CF_8466_408f_8CB1_C435C8B39344" isRoot="false" isLeaf="false" isAbstract="false" visibility="public">
          <UML:ModelElement.taggedValue>
            <UML:TaggedValue tag="parent" value="EAPK_48F97E3E_76B1_4984_B35E_7ABA2F4C806D"/>
            <UML:TaggedValue tag="ea_package_id" value="4"/>
            <UML:TaggedValue tag="created" value="2024-01-21 00:00:00"/>
            <UML:TaggedValue tag="modified" value="2024-01-21 00:00:00"/>
            <UML:TaggedValue tag="iscontrolled" value="FALSE"/>
            <UML:TaggedValue tag="version" value="1.0"/>
            <UML:TaggedValue tag="isprotected" value="FALSE"/>
            <UML:TaggedValue tag="usedtd" value="FALSE"/>
            <UML:TaggedValue tag="logxml" value="FALSE"/>
            <UML:TaggedValue tag="packageFlags" value="isModel=1;VICON=2;CRC=0;"/>
            <UML:TaggedValue tag="phase" value="1.0"/>
            <UML:TaggedValue tag="status" value="Propuesto"/>
            <UML:TaggedValue tag="author" value="Diana Montano"/>
            <UML:TaggedValue tag="complexity" value="1"/>
            <UML:TaggedValue tag="ea_stype" value="Public"/>
            <UML:TaggedValue tag="tpos" value="0"/>
            <UML:TaggedValue tag="gentype" value="Java"/>
          </UML:ModelElement.taggedValue>`;

  private objetosP = `
  </UML:Namespace.ownedElement>
  <UML:Collaboration.interaction/>
  </UML:Collaboration>
  </UML:Namespace.ownedElement>
  </UML:Package>
  </UML:Namespace.ownedElement>
  </UML:Model>

  <UML:Diagram name="diagrama-secuencia" xmi.id="EAID_509CAD9D_E800_432e_AA85_0778F4FDE823" diagramType="SequenceDiagram" owner="EAPK_6ECAC6CF_8466_408f_8CB1_C435C8B39344" toolName="Enterprise Architect 2.5">
  <UML:ModelElement.taggedValue>
    <UML:TaggedValue tag="version" value="1.0"/>
    <UML:TaggedValue tag="author" value="Diana Montano"/>
    <UML:TaggedValue tag="created_date" value="2024-01-21 18:29:56"/>
    <UML:TaggedValue tag="modified_date" value="2024-01-21 18:33:04"/>
    <UML:TaggedValue tag="package" value="EAPK_6ECAC6CF_8466_408f_8CB1_C435C8B39344"/>
    <UML:TaggedValue tag="type" value="Sequence"/>
    <UML:TaggedValue tag="swimlanes" value="locked=false;orientation=0;width=0;inbar=false;names=false;color=0;bold=false;fcol=0;;cls=0;"/>
    <UML:TaggedValue tag="matrixitems" value="locked=false;matrixactive=false;swimlanesactive=true;width=1;"/>
    <UML:TaggedValue tag="ea_localid" value="4"/>
    <UML:TaggedValue tag="EAStyle" value="ShowPrivate=1;ShowProtected=1;ShowPublic=1;HideRelationships=0;Locked=0;Border=1;HighlightForeign=1;PackageContents=1;SequenceNotes=0;ScalePrintImage=0;PPgs.cx=1;PPgs.cy=1;DocSize.cx=827;DocSize.cy=1075;ShowDetails=0;Orientation=P;Zoom=100;ShowTags=0;OpParams=1;VisibleAttributeDetail=0;ShowOpRetType=1;ShowIcons=1;CollabNums=0;HideProps=0;ShowReqs=0;ShowCons=0;PaperSize=1;HideParents=0;UseAlias=0;HideAtts=0;HideOps=0;HideStereo=0;HideElemStereo=0;ShowTests=0;ShowMaint=0;ConnectorNotation=UML 2.1;ExplicitNavigability=0;AdvancedElementProps=1;AdvancedFeatureProps=1;AdvancedConnectorProps=1;ShowNotes=0;SuppressBrackets=0;SuppConnectorLabels=0;PrintPageHeadFoot=0;ShowAsList=0;"/>
    <UML:TaggedValue tag="styleex" value="ExcludeRTF=0;DocAll=0;HideQuals=0;AttPkg=1;ShowTests=0;ShowMaint=0;SuppressFOC=0;INT_ARGS=;INT_RET=;INT_ATT=;SeqTopMargin=50;MatrixActive=0;SwimlanesActive=1;MatrixLineWidth=1;MatrixLocked=0;TConnectorNotation=UML 2.1;TExplicitNavigability=0;AdvancedElementProps=1;AdvancedFeatureProps=1;AdvancedConnectorProps=1;ProfileData=;MDGDgm=;STBLDgm=;ShowNotes=0;VisibleAttributeDetail=0;ShowOpRetType=1;SuppressBrackets=0;SuppConnectorLabels=0;PrintPageHeadFoot=0;ShowAsList=0;"/>
  </UML:ModelElement.taggedValue>
  <UML:Diagram.element>`;

  private pieP = `</UML:Diagram.element>
                </UML:Diagram>
              </XMI.content>
              <XMI.difference/>
              <XMI.extensions xmi.extender="Enterprise Architect 2.5"/>
            </XMI>`;

  async create(createRoomDto: CreateRoomDto) {
    const { ownerId, ...data } = createRoomDto;

    const user = await this.userService.findOneById(ownerId);

    const randomNumber = this.generateRandomNumber().toString();

    const room = this.roomRepository.create({
      ...data,
      invitation_token: randomNumber,
      owner: user,
    });

    return await this.roomRepository.save(room);
  }

  async findAll() {
    return await this.roomRepository.find();
  }

  async findOne(id: number) {
    const room = await this.roomRepository.findOneBy({ id: id });

    if (!room) {
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

  async findByInvitationToken(invitationDto: InvitationDto) {
    const { jwt, invitationToken } = invitationDto;

    const room = await this.roomRepository.findOneBy({
      invitation_token: invitationToken,
    });

    if (!room) {
      throw new NotFoundException(
        `Room with invitation token ${invitationToken} not found`,
      );
    }

    const linkInvitation = `http://54.71.131.29:8080/model-c4?room=${room.id}&username=${jwt}`;

    return linkInvitation;
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

  async getDiagram(id: number) {
    const room = await this.findOne(id);
    
    return room.diagram;
  }

  async generateCodeFromDiagram(roomId: number, generateCodeDto: CreateOpenaiDto) {
    generateCodeDto.xmlDiagram = await this.getDiagram(roomId);

    const code = await this.openaiService.generateCodeFromDiagram(generateCodeDto);

    return code;
  }
  
  async exportDiagramToXMI(id: number) {
    const proyecto = await this.findOne(id);

    /// Obtener el artefacto (XML) del proyecto
    const artefacto = proyecto.diagram;
    let xmlFinal = this.xmlEncabezado;

    // Llamar a la función para encontrar usuarios
    const xmlUsers = this.findUsers(artefacto);
    xmlFinal += xmlUsers;

    let objetos = '';
    objetos += '<UML:Collaboration xmi.id="EAID_68FDBDA8_B4B6_41a3_90A1_3301F4D1425D_Collaboration" name="Collaborations">';
    objetos += '<UML:Namespace.ownedElement>';
    // objetos += this.findObjects(artefacto);
    xmlFinal += objetos;
    xmlFinal += this.objetosP;
    xmlFinal += this.findPie(artefacto);
    xmlFinal += this.pieP;

    // Nombre de archivo sugerido para la descarga
    const filename = 'archivo.xml';

    const headers = {
      'Content-Type': 'application/xml',
      'Content-Disposition': `attachment; filename="${filename}"`,
    };

    return {
      status: 200,
      headers,
      body: xmlFinal,
    };
  }

  async findPie(xmlString: string): Promise<string> {
    try {
      const xml = await this.parseXml(xmlString);

      if (!xml) {
        return 'No se pudo cargar el XML.';
      }

      let contadorx = 100;
      let i = 1;
      let pie = '';

      for (const mxCell of xml.root.mxCell) {
        const style = mxCell.$.style;
        const id = mxCell.$.id;

        if (!style.includes('participant=umlActor')) {
          pie += `
            <UML:DiagramElement geometry="Left=${contadorx};Top=50;Right=${contadorx};Bottom=276;" subject="EAID_60C48589_16F7_4c60_B7B2_862227190FC${id}" seqno="${i}" style="DUID=12345JC${id};"/>
          `;
          contadorx += 160;
          i++;
        }
      }

      return pie;
    } catch (error) {
      return 'Error al analizar el XML.';
    }
  }

  async findObjects(xmlString: string): Promise<string> {
    try {
      const xml = await this.parseXml(xmlString);

      if (!xml) {
        return 'No se pudo cargar el XML.';
      }

      let obj = '';
      let iterador = 3;

      for (const mxCell of xml.root.mxCell) {
        const style = mxCell.$.style;
        const value = mxCell.$.value;
        const id = mxCell.$.id;

        if (!style.includes('participant=umlActor')) {
          obj += `
            <UML:ClassifierRole name="${value}" xmi.id="EAID_60C48589_16F7_4c60_B7B2_862227190FC${id}" visibility="public" base="EAID_11111111_5487_4080_A7F4_41526CB0AA00">
                <UML:ModelElement.taggedValue>
                    <UML:TaggedValue tag="isAbstract" value="false"/>
                    <!-- Agrega aquí los otros TaggedValues necesarios -->
                </UML:ModelElement.taggedValue>
            </UML:ClassifierRole>
          `;
          iterador++;
        }
      }

      return obj;
    } catch (error) {
      return 'Error al analizar el XML.';
    }
  }

  async findUsers(xmlString: string): Promise<string> {
    try {
        // Parsear el XML usando una función asincrónica
        const xml = await this.parseXml(xmlString);

        // Verificar si el XML se pudo cargar
        if (!xml) {
            return 'No se pudo cargar el XML.';
        }

        // Inicializar una cadena para almacenar el resultado (usuarios en formato XMI)
        let actor = '';

        // Iterar sobre los elementos mxCell en el XML
        for (const mxCell of xml.root.mxCell) {
            const style = mxCell.$.style;  // Obtener el atributo 'style' del elemento
            console.log('style', style);
            const value = mxCell.$.value;  // Obtener el atributo 'value' del elemento
            console.log('value', value);
            const id = mxCell.$.id;        // Obtener el atributo 'id' del elemento
            console.log('id', id);

            // Verificar si el estilo incluye 'participant=umlActor'
            if (style.includes('participant=umlActor')) {
                // Construir el fragmento XML correspondiente a un Actor en formato XMI
                actor += `
                    <UML:Actor name="${value}" xmi.id="EAID_60C48589_16F7_4c60_B7B2_862227190FC${id}" visibility="public" namespace="EAPK_68FDBDA8_B4B6_41a3_90A1_3301F4D1425D" isRoot="false" isLeaf="false" isAbstract="false">
                        <UML:ModelElement.taggedValue>
                            <UML:TaggedValue tag="isSpecification" value="false"/>
                            <!-- Agrega aquí los otros TaggedValues necesarios -->
                        </UML:ModelElement.taggedValue>
                    </UML:Actor>
                `;
            }
        }

        // Devolver el resultado (usuarios en formato XMI)
        return actor;
    } catch (error) {
        // Manejar cualquier error que pueda ocurrir al analizar el XML
        return 'Error al analizar el XML.';
    }
  }

  private async parseXml(xmlString: string): Promise<any> {
    return new Promise((resolve, reject) => {
      parseString(xmlString, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }
}
