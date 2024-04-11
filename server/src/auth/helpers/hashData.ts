import * as bcrypt from 'bcrypt';

export async function hashData(data: any) {
    return await bcrypt.hash(data, 10);
  }
