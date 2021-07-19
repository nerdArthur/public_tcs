import { Registro } from "./Registro";
import { Entity, PrimaryColumn, Column, OneToMany, ManyToOne } from "typeorm";
import { User } from "./User";

export enum CampanhaStatus {
  CRIADA = "C",
  INICIADA = "I",
  FINALIZADA = "F",
}

@Entity({ name: "Campanha" })
export class Campanha {
  @PrimaryColumn({ type: "varchar", nullable: false })
  id!: string;

  @ManyToOne((type) => User, (user) => user.campanhas, {
    onDelete: "CASCADE",
  })
  user!: User;

  @Column({ type: "varchar", nullable: false })
  name!: string;

  @Column({ type: "varchar", length: 3, nullable: false })
  status!: CampanhaStatus;

  @OneToMany(() => Registro, (registro) => registro.campanha, {
    eager: true,
    cascade: true,
  })
  registros?: Registro[];
}
