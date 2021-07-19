import { Entity, PrimaryColumn, Column, OneToMany } from "typeorm";
import { Campanha } from "./Campanha";
@Entity({ name: "user" })
export class User {
  @PrimaryColumn({ type: "varchar", length: 50, nullable: false })
  id!: string;

  @Column({ type: "varchar", nullable: false, unique: true })
  email!: string;

  @Column({ type: "varchar", nullable: false })
  password!: string;

  @Column({ type: "varchar", length: 25, nullable: true })
  username?: string;

  @OneToMany(() => Campanha, (campanha) => campanha.user, {
    cascade: true,
  })
  campanhas?: Campanha[];
}
