import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("locale")
export class Locale {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({
    type: "varchar",
    length: 5,
    unique: true,
    nullable: false,
  })
  code: string;
}
