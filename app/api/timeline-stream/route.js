export const dynamic = "force-dynamic";

export async function GET(request) {
  let responseStream = new TransformStream();
  const writer = responseStream.writable.getWriter();
  const encoder = new TextEncoder();

  const sendEvent = (event, data) => {
    writer.write(encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`));
  };

  let intervalId;
  const startStream = () => {
    let step = 0;
    const events = [
      { timestamp: new Date().toLocaleTimeString(), status: "info", badge: "Agent", text: "Initializing headless browser session...", retryCount: 0 },
      { timestamp: new Date().toLocaleTimeString(), status: "loading", badge: "Navigation", text: "Navigating to LinkedIn Login page", retryCount: 0 },
      { timestamp: new Date().toLocaleTimeString(), status: "warning", badge: "Network", text: "Connection timed out, retrying navigation", retryCount: 1 },
      { timestamp: new Date().toLocaleTimeString(), status: "success", badge: "Navigation", text: "Successfully loaded LinkedIn Login page", retryCount: 1 },
      { timestamp: new Date().toLocaleTimeString(), status: "loading", badge: "Authentication", text: "Entering credentials", retryCount: 0 },
      { timestamp: new Date().toLocaleTimeString(), status: "success", badge: "Authentication", text: "Authenticated successfully", retryCount: 0 },
      { timestamp: new Date().toLocaleTimeString(), status: "loading", badge: "Interaction", text: "Searching for 'Python Developer' jobs", retryCount: 0 },
      { timestamp: new Date().toLocaleTimeString(), status: "success", badge: "Extraction", text: "Extracted 12 job postings from list", retryCount: 0 },
      { timestamp: new Date().toLocaleTimeString(), status: "error", badge: "Extraction", text: "Failed to open detail view for TechCorp listing", retryCount: 2 },
      { timestamp: new Date().toLocaleTimeString(), status: "success", badge: "Task", text: "Job scraping task completed successfully", retryCount: 0 }
    ];

    intervalId = setInterval(() => {
      if (step < events.length) {
        // Update timestamp to current time for the live feel
        const currentEvent = {
          ...events[step],
          id: Math.random().toString(36).substring(7),
          timestamp: new Date().toLocaleTimeString()
        };
        sendEvent("timeline-update", currentEvent);
        step++;
      } else {
        clearInterval(intervalId);
      }
    }, 3000); // Send a new event every 3 seconds
  };

  startStream();

  request.signal.addEventListener("abort", () => {
    clearInterval(intervalId);
    writer.close();
  });

  return new Response(responseStream.readable, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      "Connection": "keep-alive",
    },
  });
}
