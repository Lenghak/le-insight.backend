import Serializer from "json-api-serializer";

export const JSON_API_SERIALIZER = "JSON_API_SERIALIZER";

export const jsonAPISerializerProvider = {
  provide: JSON_API_SERIALIZER,
  useFactory: () => {
    return new Serializer({
      convertCase: "snake_case",
    });
  },
  export: [JSON_API_SERIALIZER],
};
