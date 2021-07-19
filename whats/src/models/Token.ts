import { Entity, PrimaryColumn, Column } from "typeorm";

@Entity({ name: "Token" })
export class Token {
  @PrimaryColumn({ type: "varchar", nullable: false })
  id!: string;

  @Column({ type: "varchar", length: 50, nullable: false })
  cdUser!: string;

  @Column({ type: "varchar", length: 50, nullable: false })
  token!: string;

  @Column({ type: "date", nullable: false })
  expirationDate!: Date;
}
