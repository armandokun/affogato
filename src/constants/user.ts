export enum PlanCode {
  FREE = "free",
  PRO = "pro",
  UNLIMITED = "unlimited",
}

type Entitlements = {
  maxMessagesPerDay: number;
};

export const entitlementsByPlanCode: Record<PlanCode, Entitlements> = {
  [PlanCode.FREE]: {
    maxMessagesPerDay: 20,
  },
  [PlanCode.PRO]: {
    maxMessagesPerDay: 200,
  },
  [PlanCode.UNLIMITED]: {
    maxMessagesPerDay: 2000,
  },
};
