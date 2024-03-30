import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import { argv } from 'process';

const prisma = new PrismaClient();

const fileName = argv[2];

async function main() {
  const readStream = fs.createReadStream(fileName, 'utf-8');
  readStream.on('data', async (chunk: string) => {
    const lines = chunk.split('\n');
    for (const line of lines) {
      console.log(line);
      await prisma.memo.create({
        data: {
          content: line,
        },
      });
    }
  });
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
