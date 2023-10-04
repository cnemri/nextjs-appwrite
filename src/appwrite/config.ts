import conf from "@/conf/config";
import { Client, Account, ID } from "appwrite";
import exp from "constants";

type CreateUserAccount = {
  email: string;
  password: string;
  name: string;
};

type LoginUserAccount = {
  email: string;
  password: string;
};

const appwriteClient = new Client();
appwriteClient.setEndpoint(conf.appwriteUrl).setProject(conf.appwriteProjectId);

export const account = new Account(appwriteClient);

class AppwriteService {
  async createUserAccount({ email, password, name }: CreateUserAccount) {
    try {
      const userAccount = await account.create(
        ID.unique(),
        email,
        password,
        name
      );
      if (userAccount) {
        return this.login({ email, password });
      } else {
        return userAccount;
      }
    } catch (error: any) {
      throw new Error(
        error.message || "Error creating user account with Appwrite"
      );
    }
  }

  async login({ email, password }: LoginUserAccount) {
    try {
      const userAccount = await account.createEmailSession(email, password);
      return userAccount;
    } catch (error: any) {
      throw new Error(error.message || "Error logging in with Appwrite");
    }
  }
  async isLoggedIn(): Promise<boolean> {
    try {
      const data = await this.getCurrentUser();
      return Boolean(data);
    } catch (error: any) {}
    return false;
  }
  async getCurrentUser() {
    try {
      return account.get();
    } catch (error: any) {
      console.log("getCurentUser error" + error);
    }
    return null;
  }
  async logout() {
    try {
      return account.deleteSession("current");
    } catch (error) {
      console.log("logout error" + error);
    }
  }
}

const appwriteService = new AppwriteService();
export default appwriteService;
