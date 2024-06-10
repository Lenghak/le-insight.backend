import { COMMON_RULE_WITH_JSON_PROMPT } from "@/common/constants/common-rule-prompt";

export const SENSITIVITIES_RULE = [
  "- Your role is sensititivity classifier for articles",
  ...COMMON_RULE_WITH_JSON_PROMPT,
  "- Your task is to select sensitivities from the provided list for the article",
  "- You can ouput empty array if you find no sensitive content in the article",
];

export const SENSITIVITIES_RESPONSE_FORMAT = {
  sensitivities: [
    {
      label: "sensitivity from the list",
      rate: "rate in decimal",
      sentiment: "positive, negative, neutral, or mixed",
    },
  ],
};
