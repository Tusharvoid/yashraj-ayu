function isValidPublishableKey(value: string | undefined) {
  return Boolean(value && /^(pk_(test|live)_.+|pk_.+)$/i.test(value))
}

function isValidSecretKey(value: string | undefined) {
  return Boolean(value && /^(sk_(test|live)_.+|sk_.+)$/i.test(value))
}

export function isClerkConfigured() {
  return isValidPublishableKey(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY)
    && isValidSecretKey(process.env.CLERK_SECRET_KEY)
}
