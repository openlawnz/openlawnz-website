function isLocalHostName(hostname) {
  return (
    hostname === "localhost" ||
    hostname === "127.0.0.1" ||
    hostname === "::1" ||
    hostname === "[::1]" ||
    hostname.endsWith(".localhost")
  )
}

export const onClientEntry = async () => {
  const isDevelopment = process.env.NODE_ENV === "development"
  const isLocalHost = isLocalHostName(window.location.hostname)
  if (!isDevelopment && !isLocalHost) {
    return
  }

  const { worker } = await import("./src/mocks/browser")
  await worker.start({
    onUnhandledRequest: "bypass",
    serviceWorker: { url: "/mockServiceWorker.js" },
  })
}
