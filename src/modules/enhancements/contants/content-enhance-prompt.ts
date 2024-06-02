import { COMMON_RULE_WITH_JSON_PROMPT } from "@/common/constants/common-rule-prompt";

import { ContentToneEnumSchema } from "@/modules/enhancements/dto/content-options.dto";

export const CONTENT_ENHANCEMENT_PROMPT = [
  ...COMMON_RULE_WITH_JSON_PROMPT,
  "- MAKE SURE TO KEEP THE USER WRITING STYLES, CONTEXT, AND DO NOT SHORTEN THE CONTENT",
];

export const CONTENT_TONE_CHANGE_PROMPT = {
  [ContentToneEnumSchema.Enum.academic]:
    "We aim to elevate the level of discourse, ensuring that the content is scholarly, well-researched, and suitable for academic purposes.",
  [ContentToneEnumSchema.Enum.business]:
    "We aim to create a professional, persuasive, and engaging message that aligns with the corporate world.",
  [ContentToneEnumSchema.Enum.casual]:
    "We want to create a relaxed, friendly, and conversational vibe that resonates with your audience.",
  [ContentToneEnumSchema.Enum.childfriendly]:
    "We want to create a tone that is playful, interactive, and suitable for young minds to enjoy and understand.",
  [ContentToneEnumSchema.Enum.emotional]:
    "We want to create a deep, heartfelt connection with the audience, evoking strong emotions and leaving a lasting impact.",
  [ContentToneEnumSchema.Enum.humorous]:
    "We want to create a jovial and entertaining atmosphere that will make your audience burst into laughter.",
  [ContentToneEnumSchema.Enum.informative]:
    "We aim to provide valuable insights, educate the audience, and deliver information in a clear and concise manner.",
  [ContentToneEnumSchema.Enum.inspirational]:
    "We aim to provide uplifting messages, empower the audience, and inspire them to reach their full potential.",
  [ContentToneEnumSchema.Enum.memeified]:
    "We aim to make it hilarious, funny, and full of joke potential for gen z!",
  [ContentToneEnumSchema.Enum.narrative]:
    "We aim to create a captivating story that engages the audience, evokes emotions, and brings the content to life through vivid storytelling.",
  [ContentToneEnumSchema.Enum.objective]:
    "We aim to present information impartially, focusing on facts and avoiding personal opinions or biases.",
  [ContentToneEnumSchema.Enum.persuasive]:
    "We aim to engage and influence the audience, using compelling arguments and persuasive language to convince them of a particular viewpoint or take action.",
  [ContentToneEnumSchema.Enum.poetic]:
    "We aim to create a lyrical and elegant experience, using beautiful language and imagery that evokes emotions and stirs the imagination.",
};
