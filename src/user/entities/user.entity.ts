import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({
    length: 50,
    comment: '用户名',
  })
  username: string;
  @Column({
    //类型是 VARCHAR(50)
    length: 50,
    comment: '密码',
  })
  password: string;
  @CreateDateColumn({
    //@CreateDateColumn 会在第一次保存的时候设置一个时间戳，之后一直不变
    comment: '创建时间',
  })
  createTime: Date;
  @UpdateDateColumn({
    //@UpdateDateColumn 则是每次更新都会修改这个时间戳
    comment: '更新时间',
  })
  updateTime: Date;
}
