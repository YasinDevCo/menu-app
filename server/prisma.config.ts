import 'dotenv/config'
import { defineConfig } from 'prisma/config'

export default defineConfig({
    schema: 'prisma/schema.prisma', // مسیر فایل schema ات
    datasource: {
        url: process.env.DATABASE_URL!,
    },
})