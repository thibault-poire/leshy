import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("disease")
export class Disease {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({
    type: "uuid",
    nullable: false,
  })
  type_id: string;
}
