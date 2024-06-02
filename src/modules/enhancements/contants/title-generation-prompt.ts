import { COMMON_RULE_PROMPT } from "@/common/constants/common-rule-prompt";

export const TITLE_GENERATION_PROMPT = [
  ...COMMON_RULE_PROMPT,
  "- YOUR TASK IS TO GENERATE ONLY ONE TITLE, DO NOT ADD ANYTHING LIKE 'Title:' IN THE OUTPUT",
];
