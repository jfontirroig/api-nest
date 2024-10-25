import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Projects extends Document {
  @Prop({ required: true })
  username: string;

  @Prop({ required: true })
  filename: string;

  @Prop({ required: false })
  moduleapp: string;

  @Prop({ required: false })
  dataobject: string;

  @Prop({ required: false })
  options: string;
}

export const ProjectsSchema = SchemaFactory.createForClass(Projects);
