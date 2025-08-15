import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
});

const authUrl = "/api/auth/login";

// NextAuth options
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

                    const loginData = data?.data;

                    // console.log(loginData);

                    if (loginData && loginData.token) {
                        // Return the full user + tokens
                        return {
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
                // Store everything in token
                token.user = user.user; // The actual user object
                token.token = user.token;
            }
            return token;
        },
        async session({ session, token }) {
            // Attach everything to session
            session.user = token.user;
            session.token = token.token;
            return session;
        },
    },
    secret: process.env.NEXTAUTH_SECRET,
};

const handler = (req, res) => NextAuth(req, res, authOptions);
export { handler as GET, handler as POST };
