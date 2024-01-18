import { Room } from "src/room/entities/room.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    username: string;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @OneToMany(
      () => Room,
      (room) => room.owner,
    )
    rooms: Room[];
}
