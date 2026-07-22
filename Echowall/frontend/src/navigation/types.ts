import { NativeStackScreenProps } from '@react-navigation/native-stack';

export type RootStackParamList = {
  Splash: undefined;
  Welcome: undefined;
  Auth: undefined;
  Dashboard: undefined;
  Profile: undefined;
  CreateCommunity: undefined;
  JoinCommunity: undefined;
  Community: { communityId: number };
  CommunitySettings: { communityId: number };
  CreateEcho: { communityId: number };
  Gallery: { communityId: number };
};

export type RootStackScreenProps<T extends keyof RootStackParamList> = NativeStackScreenProps<RootStackParamList, T>;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}