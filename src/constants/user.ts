export enum UserType {
  FREE = "free",
  PRO = "pro",
  UNLIMITED = "unlimited",
}

type Entitlements = {
  maxMessagesPerDay: number;
};

export const entitlementsByUserType: Record<UserType, Entitlements> = {
  [UserType.FREE]: {
    maxMessagesPerDay: 20,
  },
  [UserType.PRO]: {
    maxMessagesPerDay: 200,
  },
  [UserType.UNLIMITED]: {
    maxMessagesPerDay: 2000,
  },
};
