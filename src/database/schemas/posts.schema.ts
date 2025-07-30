import mongoose, { Schema } from 'mongoose';
import { SchemaParameters } from '../mongodb.types';

import { Post } from 'types/post.type';

const data: SchemaParameters<Post> = {
  id: {
    type: mongoose.SchemaTypes.String,
    required: true,
    unique: true,
  },

  content: {
    type: mongoose.SchemaTypes.String,
    required: true,
  },

  name: {
    type: mongoose.SchemaTypes.String,
    required: true,
  },

  created_at: {
    type: mongoose.SchemaTypes.String,
    required: true,
  },
};
const schema = new Schema<Post>(data);
const keys = Object.keys(data) as unknown as (keyof Post)[];

const database = mongoose.model('posts', schema);

export { schema as PostsSchema, keys as PostsKeys };

export default database;
