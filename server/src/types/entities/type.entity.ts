import { Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("type")
export class Type {
  @PrimaryGeneratedColumn("uuid")
  id: string;
}
