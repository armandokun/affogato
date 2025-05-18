export enum PlanType {
  FREE = "free",
  PRO = "pro",
  UNLIMITED = "unlimited",
}

type Entitlements = {
  maxMessagesPerDay: number;
};

export const entitlementsByPlanId: Record<PlanType, Entitlements> = {
  [PlanType.FREE]: {
    maxMessagesPerDay: 20,
  },
  [PlanType.PRO]: {
    maxMessagesPerDay: 200,
  },
  [PlanType.UNLIMITED]: {
    maxMessagesPerDay: 2000,
  },
};
