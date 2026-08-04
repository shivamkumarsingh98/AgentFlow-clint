export const dynamic = "force-dynamic";

export async function GET(request) {
  let responseStream = new TransformStream();
  const writer = responseStream.writable.getWriter();
  const encoder = new TextEncoder();

  // Helper to send SSE formatted data
  const sendEvent = (event, data) => {
    writer.write(encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`));
  };

  // Mock stream simulation
  let intervalId;
  const startStream = () => {
    let step = 0;
    const states = [
      { url: "https://linkedin.com/jobs", status: "navigating", isLoading: true, screenshotUrl: null },
      { url: "https://linkedin.com/jobs", status: "searching", isLoading: false, screenshotUrl: "/mock-screenshot-1.png" },
      { url: "https://linkedin.com/jobs/search?q=python", status: "extracting", isLoading: true, screenshotUrl: "/mock-screenshot-2.png" },
      { url: "https://linkedin.com/jobs/view/12345", status: "analyzing", isLoading: false, screenshotUrl: "/mock-screenshot-3.png" },
      { url: "https://linkedin.com/jobs/view/12345", status: "completed", isLoading: false, screenshotUrl: "/mock-screenshot-4.png" }
    ];

    intervalId = setInterval(() => {
      if (step < states.length) {
        sendEvent("browser-update", states[step]);
        step++;
      } else {
        // Reset and loop mock for demo purposes
        step = 0;
      }
    }, 4000); // Update every 4 seconds
  };

  startStream();

  // Handle client disconnect
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
