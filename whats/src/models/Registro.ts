import { Entity, PrimaryColumn, Column, ManyToOne } from "typeorm";
import { Campanha } from "./Campanha";

export enum StatusRegistro {
  INATIVO = "I",
  SOLICITADO = "S",
  ENVIADO = "E",
  RECEBIDO = "R",
  LIDO = "L",
}
@Entity({ name: "Registro" })
export class Registro {
  @PrimaryColumn({ type: "varchar", nullable: false })
  id!: string;

  @Column({ type: "int", nullable: false })
  linha!: number;

  @Column({ type: "varchar", nullable: false })
  cdLinha!: string;

  @Column({ type: "varchar", length: 25, nullable: false })
  telefoneDestinatario!: string;

  @Column({ type: "varchar", nullable: false })
  arquivoOuLink!: string;

  @Column({ type: "varchar", length: 150, nullable: false })
  nomeDestinatario!: string;

  @ManyToOne(() => Campanha, (campanha) => campanha.registros, {
    onDelete: "CASCADE",
  })
  campanha!: Campanha;

  @Column({ type: "varchar", length: 3, nullable: true })
  status?: StatusRegistro;
}
