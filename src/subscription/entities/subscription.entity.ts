import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

export enum EFrequency {
  HOURLY = 'hourly',
  DAILY = 'daily',
}
@Entity({ name: 'subscriptions', comment: 'Weather subscription table' })
export class SubscriptionEntity {
  @PrimaryGeneratedColumn('uuid', { comment: 'Primary key: subscription UUID' })
  id: string;

  @Column({ unique: true, comment: 'Email address to receive weather updates' })
  email: string;

  @Column({ comment: 'City for weather updates' })
  city: string;

  @Column({
    type: 'enum',
    enum: EFrequency,
    default: EFrequency.DAILY,
    comment: 'Frequency of updates: hourly or daily',
  })
  frequency: EFrequency;

  @Column({
    default: false,
    comment: 'Weather the subscription has been confirmed',
  })
  confirmed: boolean;

  @Column({ comment: 'Token for confirmation/unsubscribe operations' })
  token: string;
}
