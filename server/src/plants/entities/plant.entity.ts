import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("plant")
export class Plant {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({
    type: "varchar",
    length: 255,
    unique: true,
    nullable: false,
  })
  binomial_name: string;
}
