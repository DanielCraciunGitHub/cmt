import { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaClient } from "@prisma/client"
import bcrypt from "bcrypt"

const prisma = new PrismaClient()

export const authConfig: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        name: { label: "Name", type: "text" },
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        const { name, email, password } = credentials as User

        if (req.body?.callbackUrl.includes("login")) {
          const user = await prisma.user.findFirst({
            where: { email },
          })
          if (user && (await bcrypt.compare(password, user.password))) {
            return user
          } else {
            throw new Error("404")
          }
        } else {
          return await prisma.user
            .create({
              data: {
                name,
                email,
                password: await bcrypt.hash(password, 10),
              },
            })
            .catch((error) => {
              console.log(error)
              throw new Error("404")
            })
        }
      },
    }),
  ],
  pages: {
    signIn: "/",
    newUser: "/",
  },
  callbacks: {
    async redirect({ baseUrl }) {
      return baseUrl
    },
  },
}