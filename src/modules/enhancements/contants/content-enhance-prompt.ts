import { COMMON_RULE_WITH_JSON_PROMPT } from "@/common/constants/common-rule-prompt";

import { ContentToneEnumSchema } from "@/modules/enhancements/dto/content-options.dto";

export const CONTENT_ENHANCEMENT_PROMPT = [
  ...COMMON_RULE_WITH_JSON_PROMPT,
  "- IF U DON'T HAVE TO UNDERSTAND THE CONTENT.",
  "- MAKE SURE TO KEEP THE CONTENT WRITING STYLES AND THE CONTEXT OF THE INPUT.",
  "- YOU MUST OUTPUT ONLY THE MODIFIED CONTENT IN THE RESPONSE WITH NO EXPLAINATION SENTENCES.",
  "- Say something if you don't understand the context.",
];

export const CONTENT_TONE_CHANGE_PROMPT = {
  [ContentToneEnumSchema.Enum.academic]:
    "- Apply the tone of scholarly, well-researched, and suitable for academic purposes.",
  [ContentToneEnumSchema.Enum.business]:
    "- Apply the tone of professional, persuasive, and engaging message that aligns with the corporate world.",
  [ContentToneEnumSchema.Enum.casual]:
    "- Apply the tone of relaxed, friendly, and conversational vibe that resonates with your audience.",
  [ContentToneEnumSchema.Enum.childfriendly]:
    "- Apply the tone of playful, interactive, and suitable for young minds to enjoy and understand.",
  [ContentToneEnumSchema.Enum.emotional]:
    "- Apply the tone of deep, heartfelt connection with the audience, evoking strong emotions and leaving a lasting impact.",
  [ContentToneEnumSchema.Enum.humorous]:
    "- Apply the tone of jovial and entertaining atmosphere that will make your audience burst into laughter.",
  [ContentToneEnumSchema.Enum.informative]:
    "- Apply the tone of valuable, educate the audience, and deliver information in a clear and concise manner.",
  [ContentToneEnumSchema.Enum.inspirational]:
    "- Apply the tone of uplifting, empower the audience, and inspire them to reach their full potential.",
  [ContentToneEnumSchema.Enum.memeified]:
    "- Apply the tone of hilarious, funny, and full of joke potential for going viral!",
  [ContentToneEnumSchema.Enum.narrative]:
    "- Apply the tone of captivating that engages the audience, evokes emotions, and brings the content to life through vivid storytelling.",
  [ContentToneEnumSchema.Enum.objective]:
    "- Apply the tone of informative, focusing on facts and avoiding personal opinions or biases.",
  [ContentToneEnumSchema.Enum.persuasive]:
    "- Apply the tone of influencing, using compelling arguments and persuasive language to convince them of a particular viewpoint or take action.",
  [ContentToneEnumSchema.Enum.poetic]:
    "- Apply the tone of a lyrical and elegant, using beautiful language and imagery that evokes emotions and stirs the imagination.",
};
