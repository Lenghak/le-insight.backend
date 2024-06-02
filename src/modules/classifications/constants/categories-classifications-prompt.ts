import { COMMON_RULE_PROMPT } from "@/common/constants/common-rule-prompt";

export const CATEGORIES_RULE = [
  "- YOUR ROLE IS TO BE AN ARTICLE WRITER ASSISITANT EXPERT.",
  "- YOUR TASK IS TO SUGGEST MOST SUITABLE CATEGORIES (MAX: 3) FOR THE INPUT ARTICLE, AND OUTPUT IN DECENDING ORDER OF RATE.",
  ...COMMON_RULE_PROMPT,
];
export const CATEGORIES_RESPONSE_FORMAT = {
  categories: [
    {
      label: "category",
      rate: "rate in decimal",
    },
  ],
};
