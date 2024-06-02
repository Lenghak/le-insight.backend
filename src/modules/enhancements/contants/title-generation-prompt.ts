import { COMMON_RULE_PROMPT } from "@/common/constants/common-rule-prompt";

export const TITLE_GENERATION_PROMPT = [
  ...COMMON_RULE_PROMPT,
  "- YOUR TASK IS TO GENERATE A TITLE FROM THE INPUT CONTENT",
];
