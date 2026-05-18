type ServerLogMeta = Record<string, unknown>;

function getErrorSummary(error: unknown) {
  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
    };
  }

  return {
    name: "UnknownError",
    message: "Unknown server error.",
  };
}

export function logServerError(
  scope: string,
  error: unknown,
  meta?: ServerLogMeta
) {
  const summary = getErrorSummary(error);
  const payload = meta ? { ...summary, ...meta } : summary;

  if (process.env.NODE_ENV === "production") {
    console.error(`[${scope}]`, payload);
    return;
  }

  console.error(`[${scope}]`, payload, error);
}
