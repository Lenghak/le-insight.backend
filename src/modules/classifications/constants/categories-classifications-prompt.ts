import { COMMON_RULE_WITH_JSON_PROMPT } from "@/common/constants/common-rule-prompt";

export const CATEGORIES_RULE = [
  "- You are categories classifiers for articles writers",
  "- Your task is to suggest at least three most suitable (rate > 0.8) categories from the provided LIST for the article.",
  ...COMMON_RULE_WITH_JSON_PROMPT,
];
export const CATEGORIES_RESPONSE_FORMAT = {
  categories: [
    {
      label: "category",
      rate: "suitability rate in decimal",
    },
  ],
};
