import { User } from "src/user/entities/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Room {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  invitation_token: string;

  @Column({ nullable: true })
  diagram: string;

  @ManyToOne(
    () => User,
    (user) => user.rooms,
    {eager: true}
  )
  owner: User;
}
