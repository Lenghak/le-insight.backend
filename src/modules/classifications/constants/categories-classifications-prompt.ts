import { COMMON_RULE_WITH_JSON_PROMPT } from "@/common/constants/common-rule-prompt";

export const CATEGORIES_RULE = [
  "- Your role is categories classifier for articles",
  ...COMMON_RULE_WITH_JSON_PROMPT,
  "- Your task is to select categories from the provided list that are the most suitable for the article",
];
export const CATEGORIES_RESPONSE_FORMAT = {
  categories: [
    {
      label: "category",
      rate: "suitability rate in decimal",
    },
  ],
};
