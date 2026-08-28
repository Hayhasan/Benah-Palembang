import "server-only"

function redisNamespace() {
  const rawPrefix = process.env.REDIS_PREFIX?.trim()
  if (!rawPrefix) {
    throw new Error("REDIS_PREFIX is required for Auth Redis keys.")
  }

  return `${rawPrefix.replace(/:+$/, "")}:auth`
}

export const authRedisKey = {
  session: (tokenHash: string) => `${redisNamespace()}:session:${tokenHash}`,
  userVersion: (userId: string) =>
    `${redisNamespace()}:user-version:${userId}`,
  lastLogin: (userId: string) => `${redisNamespace()}:last-login:${userId}`,
  lastActivity: (userId: string) =>
    `${redisNamespace()}:last-activity:${userId}`,
  presence: (userId: string) => `${redisNamespace()}:presence:${userId}`,
  activityGate: (userId: string) =>
    `${redisNamespace()}:activity-gate:${userId}`,
  loginRateIp: (ipHash: string) =>
    `${redisNamespace()}:rate:login:ip:${ipHash}`,
  loginRateEmail: (emailHash: string) =>
    `${redisNamespace()}:rate:login:email:${emailHash}`,
  registerRateIp: (ipHash: string) =>
    `${redisNamespace()}:rate:register:ip:${ipHash}`,
  registerRateEmail: (emailHash: string) =>
    `${redisNamespace()}:rate:register:email:${emailHash}`,
}
