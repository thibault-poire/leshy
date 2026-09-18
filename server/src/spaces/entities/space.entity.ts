import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("space")
export class Space {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({
    type: "varchar",
    length: 255,
    unique: true,
    nullable: false,
  })
  name: string;
}
