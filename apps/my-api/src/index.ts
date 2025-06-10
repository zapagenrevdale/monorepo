import { handle } from 'hono/aws-lambda'
import { createApp } from './app'

const app = createApp({});
console.log({ app })
export const handler = handle(app)
