import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('goals')
export class Goal {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  user_id: string;

  @Column({ type: 'varchar', length: 255 })
  goal_name: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  target_amount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  current_amount: number;

  @Column({ type: 'timestamp' })
  deadline: Date;

  @Column({ type: 'enum', enum: ['in_progress', 'completed', 'failed'] })
  status: 'in_progress' | 'completed' | 'failed';

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;
}
