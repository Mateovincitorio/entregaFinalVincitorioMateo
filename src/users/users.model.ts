import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema()
export class User {
  @Prop() first_name?: string;
  @Prop() last_name?: string;
  @Prop({ required: true, index: true, unique: true }) email: string;
  @Prop({ required: true }) password: string;
  @Prop() age?: number;
  @Prop({ enum: ['User', 'Admin'], default: 'User' }) rol: string;
  @Prop() cart: { productId: string; quantity: number }[];
}

type UserType = HydratedDocument<User>;
const UserSchema = SchemaFactory.createForClass(User);

export { UserType, UserSchema };
