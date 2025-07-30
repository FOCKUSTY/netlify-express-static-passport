import mongoose, { Schema } from 'mongoose';
import { SchemaParameters } from '../mongodb.types';

import { Auth } from 'types/auth.type';

const data: SchemaParameters<Auth> = {
  id: {
    type: mongoose.SchemaTypes.String,
    required: true,
    unique: true,
  },

  access_token: {
    type: mongoose.SchemaTypes.String,
    required: true,
  },

  name: {
    type: mongoose.SchemaTypes.String,
    required: true,
  },
};
const schema = new Schema<Auth>(data);
const keys = Object.keys(data) as unknown as (keyof Auth)[];

const database = mongoose.model('auth', schema);

export { schema as AuthUsersSchema, keys as AuthUsersKeys };

export default database;
