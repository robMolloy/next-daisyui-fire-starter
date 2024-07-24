import { z } from "zod";

type TRuleSet = {
  message: string;
} & ({ validSchema: z.ZodTypeAny } | { invalidSchema: z.ZodTypeAny });
type TRuleSets = TRuleSet[];

type TWideRuleMap = { [k in string]: TRuleSets };
type TWideFormData = { [k in string]: string };

export const createRuleMap = <
  T1 extends TWideFormData,
  T2 extends (x: T1) => { [k in keyof T1]: TRuleSets },
>(p: {
  formData: T1;
  ruleMapper: T2;
}) => {
  return p.ruleMapper(p.formData);
};

export const checkRules = (p: { rules: TRuleSets; value: string }) => {
  const errorRule = p.rules.find((x) => {
    if ("validSchema" in x) return !x.validSchema.safeParse(p.value).success;
    return x.invalidSchema.safeParse(p.value).success;
  });

  return errorRule?.message
    ? ({ success: false, error: errorRule?.message } as const)
    : ({ success: true } as const);
};

export function checkFormDataValue<T1 extends TWideRuleMap>(x: {
  ruleMap: T1;
  key: keyof T1;
  value: string;
}) {
  const initRuleSet = x.ruleMap[x.key];
  const ruleSet = initRuleSet as NonNullable<typeof initRuleSet>;
  const errorResponse = checkRules({ rules: ruleSet, value: x.value });
  return errorResponse;
}

export function checkFormDataAgainstRuleMap<
  T1 extends TWideFormData,
  T2 extends { [k in keyof T1]: TRuleSets },
>(x: { formData: T1; ruleMap: T2 }) {
  const checkResponses = (Object.keys(x.ruleMap) as (keyof typeof x.formData)[]).map((key) => {
    const initValue = x.formData[key];
    const value = initValue as NonNullable<typeof initValue>;
    const checkResponse = checkFormDataValue({ ruleMap: x.ruleMap, key, value });
    return { ...checkResponse, key };
  });
  if (checkResponses.every((x) => x.success)) return { success: true } as const;
  const errors: { [k in keyof T1]?: string } = {};
  checkResponses.forEach((x) => (errors[x.key] = x.error));
  return { success: false, errors } as const;
}
