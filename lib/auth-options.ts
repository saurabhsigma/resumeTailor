import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import connectToDatabase from "@/lib/db";
import { User } from "@/models/User";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Missing credentials");
                }

                await connectToDatabase();
                const user = await User.findOne({ email: credentials.email });

                if (!user) {
                    throw new Error("User not found");
                }

                const isValid = await bcrypt.compare(credentials.password, user.passwordHash);

                if (!isValid) {
                    throw new Error("Invalid password");
                }

                return {
                    id: user._id.toString(),
                    name: user.name,
                    email: user.email,
                    image: user.image
                };
            }
        })
    ],
    session: {
        strategy: "jwt"
    },
    callbacks: {
        async session({ session, token }) {
            if (token && session.user) {
                // @ts-ignore
                session.user.id = token.sub;
            }
            return session;
        }
    },
    pages: {
        signIn: "/login",
    },
    secret: process.env.NEXTAUTH_SECRET || "supersecret"
};
