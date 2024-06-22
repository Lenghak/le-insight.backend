import { COMMON_RULE_PROMPT } from "@/common/constants/common-rule-prompt";

export const TITLE_GENERATION_PROMPT = [
  ...COMMON_RULE_PROMPT,
  "- Your task is to generate a title from the provided input.",
  "- Your output must contain only the title without any indicators (EX: Title goes here...).",
];
