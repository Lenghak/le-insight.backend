import { COMMON_RULE_WITH_JSON_PROMPT } from "@/common/constants/common-rule-prompt";

export const SENSITIVITIES_RULE = [
  "- YOUR ROLE IS TO BE AN ARTICLE SENSITIVITIES DETECTOR.",
  "- YOUR TASK IS TO SENITIZE THE INPUT ARTICLE, AND OUTPUT IN PROVIDED JSON FORMAT",
  ...COMMON_RULE_WITH_JSON_PROMPT,
];

export const SENSITIVITIES_RESPONSE_FORMAT = {
  sensitivities: [
    {
      label: "sensitiviy",
      rate: "rate in decimal",
      language: "language of the article",
    },
  ],
};
