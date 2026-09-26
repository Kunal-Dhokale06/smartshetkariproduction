import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 10;

export async function hashPassword(plainTextPassword: string): Promise<string> {
  const salt = await bcrypt.genSalt(SALT_ROUNDS);
  return bcrypt.hash(plainTextPassword, salt);
}

export async function comparePassword(
  plainTextPassword: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(plainTextPassword, hashedPassword);
}
