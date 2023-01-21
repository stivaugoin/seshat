// @ts-check
import { clientEnv as environment, clientSchema } from "./schema.mjs";

const clientEnv = clientSchema.safeParse(environment);

export const formatErrors = (
  /** @type {import('zod').ZodFormattedError<Map<string,string>,string>} */
  errors
) =>
  Object.entries(errors)
    .map(([name, value]) => {
      if (value && "_errors" in value)
        return `${name}: ${value._errors.join(", ")}\n`;
    })
    .filter(Boolean);

if (!clientEnv.success) {
  console.error(
    "❌ Invalid environment variables:\n",
    ...formatErrors(clientEnv.error.format())
  );
  throw new Error("Invalid environment variables");
}

for (let key of Object.keys(clientEnv.data)) {
  if (!key.startsWith("NEXT_PUBLIC_") && key !== "NODE_ENV") {
    console.warn(
      `❌ Invalid public environment variable name: ${key}. It must begin with 'NEXT_PUBLIC_'`
    );

    throw new Error("Invalid public environment variable name");
  }
}

export const env = clientEnv.data;
