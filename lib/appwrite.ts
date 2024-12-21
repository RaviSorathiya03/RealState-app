import { Platform } from "react-native";
import { Account, Avatars, Client, OAuthProvider } from 'react-native-appwrite';
import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';

export const config = {
    plateform: 'com.jsm_restate',
    endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT,
    project_id: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID
};

export const client = new Client();

client
  .setEndpoint(config.endpoint!)
  .setProject(config.project_id!)
  .setPlatform(config.plateform!);

export const avatar = new Avatars(client);
export const account = new Account(client);

export async function login() {
    try {
        const redirectUri = Linking.createURL('/');
        const authUrl = await account.createOAuth2Session(
            OAuthProvider.Google,
            redirectUri
        );

        if (!authUrl) throw new Error('Failed to generate OAuth URL');

        // Ensure the URL is a string
        const formattedUrl = typeof authUrl === 'string' ? authUrl : authUrl.href;

        const browserResult = await WebBrowser.openAuthSessionAsync(formattedUrl, redirectUri);

        if (browserResult.type !== 'success') throw new Error('Login failed');

        const url = new URL(browserResult.url);
        const secret = url.searchParams.get('secret')?.toString();
        const userId = url.searchParams.get('userId')?.toString();

        if (!secret || !userId) throw new Error('Failed to retrieve user session');

        const session = await account.createSession(userId, secret);

        if (!session) throw new Error('Session creation failed');

        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
}

export async function logout() {
    try {
        await account.deleteSession('current');
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
}

export async function getUser() {
    try {
        const response = await account.get();
        if (response.$id) {
            const userAvatar = avatar.getInitials(response.name);
            return {
                ...response,
                avatar: userAvatar.toString(),
            };
        }
    } catch (error) {
        console.log(error);
        return null;
    }
}
