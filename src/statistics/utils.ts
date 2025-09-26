// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const generateBatchPayload = (eventsQueue: any[]) => ({
  events: eventsQueue,
  batchTime: Date.now(),
})
