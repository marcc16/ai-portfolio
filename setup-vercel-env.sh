# Variables públicas (disponibles en el cliente)
vercel env add NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY production
# Valor: pk_test_...

vercel env add NEXT_PUBLIC_SANITY_PROJECT_ID production
# Valor: 0uaez0my

vercel env add NEXT_PUBLIC_SANITY_DATASET production
# Valor: production

vercel env add NEXT_PUBLIC_SANITY_API_VERSION production
# Valor: 2025-10-15

# Variables privadas (solo servidor)
vercel env add CLERK_SECRET_KEY production
# Valor: sk_test_...

vercel env add OPENAI_API_KEY production
# Valor: sk-proj-...

vercel env add UPSTASH_REDIS_REST_URL production
# Valor: https://...

vercel env add UPSTASH_REDIS_REST_TOKEN production
# Valor: ...

vercel env add NODE_ENV production
# Valor: production

# IMPORTANTE: Después de configurar el webhook en Clerk, añadir:
# vercel env add CLERK_WEBHOOK_SECRET production
# Valor: whsec_... (obtenido de Clerk Dashboard)

# Redesplegar después de añadir las variables
# vercel --prod
