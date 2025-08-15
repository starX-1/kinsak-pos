import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
});

const authUrl = "/api/auth/login";

const authOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                name: { label: "Username", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                try {
                    const { data } = await api.post(authUrl, {
                        name: credentials.name,
                        password: credentials.password,
                    });

                    // ✅ The API response
                    if (data?.token && data?.user) {
                        // Return both token & user to NextAuth
                        return {
                            token: data.token,
                            user: data.user,
                        };
                    }

                    return null;
                } catch (error) {
                    console.error("Login error:", error.response?.data || error.message);
                    return null;
                }
            },
        }),
    ],
    pages: {
        signIn: "/auth/login",
    },
    session: {
        strategy: "jwt",
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.user = user.user;   // Store user details
                token.token = user.token; // Store API token
            }
            return token;
        },
        async session({ session, token }) {
            session.user = token.user;
            session.token = token.token;
            return session;
        },
    },
    secret: process.env.NEXTAUTH_SECRET,
};

const handler = (req, res) => NextAuth(req, res, authOptions);
export { handler as GET, handler as POST };
