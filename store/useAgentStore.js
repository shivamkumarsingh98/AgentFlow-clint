import { create } from "zustand";
const BACKEND_URL = (process.env.NEXT_PUBLIC_AGENT_API_URL || "http://localhost:8000").replace(/\/$/, "");

export const useAgentStore = create((set, get) => ({
  // --- STATE ---
  currentTask: null,
  agentStatus: {
    phase: "idle",
    currentStepIndex: 0,
    totalSteps: 4,
    tokensUsed: 0,
    executionTime: 0,
    retries: 0,
  },
  stepsPlan: [],
  timeline: [],
  browser: {
    url: "about:blank",
    isLoading: false,
    screenshot: null,
  },
  results: [],
  activeWorkspaceTab: "live", // "live" | "results" | "timeline"
  isProfileModalOpen: false,
  setActiveWorkspaceTab: (tab) => set({ activeWorkspaceTab: tab }),
  setProfileModalOpen: (open) => set({ isProfileModalOpen: open }),

  setTask: (prompt) => {
    const newTask = {
      id: Math.random().toString(36).substring(7),
      prompt,
      status: "idle",
      createdAt: new Date().toISOString(),
    };

    const existingSocket = get().socket;
    if (existingSocket) {
      try { existingSocket.close(); } catch (e) { }
    }

    set({
      currentTask: newTask,
      agentStatus: { phase: "idle", currentStepIndex: 0, totalSteps: 4, tokensUsed: 0, executionTime: 0, retries: 0 },
      stepsPlan: [
        { index: 1, description: "Navigate to target site", status: "pending" },
        { index: 2, description: "Extract relevant job detail cards", status: "pending" },
        { index: 3, description: "Approve extraction list (Human Checkpoint)", status: "pending" },
        { index: 4, description: "Compile results and export database", status: "pending" },
      ],
      timeline: [],
      browser: { url: "about:blank", isLoading: false, screenshot: null },
      results: [],
      socket: null,
      activeWorkspaceTab: "live",
    });
  },

  startAgent: async () => {
    const { currentTask } = get();
    if (!currentTask) return;

    set((state) => ({
      currentTask: { ...state.currentTask, status: "running" },
      agentStatus: { ...state.agentStatus, phase: "running", currentStepIndex: 1 },
      stepsPlan: state.stepsPlan.map((s) => (s.index === 1 ? { ...s, status: "active" } : s)),
    }));

    get().addTimelineEvent("info", "Agent", `Connecting to server and starting task: "${currentTask.prompt}"`);

    try {
      console.log("[useAgentStore] Hitting API /api/agent/start. Payload:", { goal: currentTask.prompt });
      const response = await fetch(`${BACKEND_URL}/api/agent/start`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({ goal: currentTask.prompt }),
      });

      console.log(`[useAgentStore] Response from /api/agent/start status: ${response.status}`);
      if (!response.ok) throw new Error(`HTTP error ${response.status}`);

      const data = await response.json();
      console.log("[useAgentStore] Response data from /api/agent/start:", data);
      const taskId = data.task_id;

      set((state) => ({ currentTask: { ...state.currentTask, id: taskId } }));

      const token = localStorage.getItem("token");
      const wsUrl = `${BACKEND_URL.replace(/^http/, "ws")}/ws/agent/${taskId}?token=${token}`;
      const ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        get().addTimelineEvent("success", "Socket", "Live monitoring session established.");
      };

      ws.onmessage = (event) => {
        try {
          const parsed = JSON.parse(event.data);
          console.log("[useAgentStore] WebSocket message received:", parsed);

          // 1. Real Screenshot handle karo
          if (parsed.type === "screenshot_event") {
            const base64Img = parsed.screenshot;
            const imgSrc = base64Img.startsWith("data:") ? base64Img : `data:image/png;base64,${base64Img}`;

            set((state) => ({
              browser: {
                ...state.browser,
                screenshot: { url: imgSrc, timestamp: new Date().toISOString() },
                isLoading: false,
              }
            }));
          }

          // 2. Timeline Events handle karo
          if (parsed.type === "timeline_event") {
            const isApproval = parsed.event_type === "approval_required";
            const isResult = parsed.event_type === "results";

            const messageText = parsed.details?.message || (typeof parsed.details === 'string' ? parsed.details : JSON.stringify(parsed.details || {}));

            // Extract and update browser URL if present in event text
            const urlMatch = messageText.match(/https?:\/\/[^\s>"]+/);
            if (urlMatch) {
              const detectedUrl = urlMatch[0];
              if (!detectedUrl.includes("duckduckgo.com/y.js")) {
                set((state) => ({
                  browser: { ...state.browser, url: detectedUrl }
                }));
              }
            }

            if (isApproval) {
              set((state) => ({
                currentTask: { ...state.currentTask, status: "waiting_approval" },
                agentStatus: { ...state.agentStatus, phase: "waiting_approval", currentStepIndex: 3 },
                stepsPlan: state.stepsPlan.map((s) => {
                  if (s.index === 2) return { ...s, status: "done" };
                  if (s.index === 3) return { ...s, status: "active" };
                  return s;
                }),
              }));
            }

            // Real JSON data ko directly results mein daalo
            if (isResult && parsed.details?.data) {
              const jobs = parsed.details.data;
              const formattedJobs = jobs.map((job) => ({
                id: Math.random().toString(36).substring(7),
                company: job.company || "N/A",
                title: job.title || "N/A",
                location: job.location || "N/A",
                salary: job.salary || "Not disclosed",
                posted_date: job.posted_date || "Recently",
                link: job.link || ""
              }));
              set({ results: formattedJobs, activeWorkspaceTab: "results" });
            }

            const status = isApproval ? "warning" : (parsed.event_type === "error" ? "error" : "info");
            get().addTimelineEvent(status, parsed.event_type || "Agent", messageText);
          }

          // 3. Status Updates handle karo
          if (parsed.type === "status_update") {
            const apiStatus = parsed.status;
            set((state) => {
              let updatedStatus = state.currentTask.status;
              let phase = state.agentStatus.phase;
              let steps = [...state.stepsPlan];

              if (apiStatus === "pending_approval") {
                updatedStatus = "waiting_approval"; phase = "waiting_approval";
                steps = steps.map((s) => {
                  if (s.index === 2) return { ...s, status: "done" };
                  if (s.index === 3) return { ...s, status: "active" };
                  return s;
                });
              } else if (apiStatus === "completed") {
                updatedStatus = "completed"; phase = "done";
                steps = steps.map((s) => ({ ...s, status: "done" }));
              } else if (apiStatus === "failed") {
                updatedStatus = "failed"; phase = "idle";
                steps = steps.map((s) => (s.status === "active" ? { ...s, status: "failed" } : s));
              } else if (apiStatus === "running") {
                updatedStatus = "running"; phase = "running";
              }

              return {
                currentTask: { ...state.currentTask, status: updatedStatus },
                agentStatus: { ...state.agentStatus, phase },
                stepsPlan: steps,
              };
            });
          }
        } catch (err) {
          console.error("Failed to parse WebSocket stream message:", err);
        }
      };

      ws.onerror = () => get().addTimelineEvent("error", "Socket", "WebSocket stream connection encountered an error.");
      ws.onclose = (event) => {
        if (event.code === 1008) {
          get().addTimelineEvent("error", "Socket", "Unauthorized - connection rejected by server.");
        } else {
          get().addTimelineEvent("info", "Socket", "WebSocket connection closed.");
        }
      };

      set({ socket: ws });

    } catch (err) {
      console.error("Error starting agent run:", err);
      get().addTimelineEvent("error", "Agent", `Failed to start agent: ${err.message}`);
      set((state) => ({ currentTask: { ...state.currentTask, status: "failed" }, agentStatus: { ...state.agentStatus, phase: "idle" } }));
    }
  },

  pauseAgent: async () => {
    const { currentTask } = get();
    if (!currentTask || currentTask.status !== "running") return;
    set((state) => ({ currentTask: { ...state.currentTask, status: "paused" } }));
    get().addTimelineEvent("warning", "Agent", "Sending pause command to agent runner...");

    try {
      await fetch(`${BACKEND_URL}/api/agent/${currentTask.id}/pause`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
      });
      get().addTimelineEvent("warning", "Agent", "Agent paused execution on server.");
    } catch (err) {
      console.error("Failed to send pause command:", err);
    }
  },

  resumeAgent: async () => {
    const { currentTask } = get();
    if (!currentTask || currentTask.status !== "paused") return;
    set((state) => ({ currentTask: { ...state.currentTask, status: "running" } }));
    get().addTimelineEvent("info", "Agent", "Sending resume command to agent runner...");

    try {
      await fetch(`${BACKEND_URL}/api/agent/${currentTask.id}/resume`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
      });
      get().addTimelineEvent("info", "Agent", "Agent resumed execution on server.");
    } catch (err) {
      console.error("Failed to send resume command:", err);
    }
  },

  stopAgent: async () => {
    const { currentTask, socket } = get();
    if (!currentTask) return;
    get().addTimelineEvent("error", "Agent", "Sending cancellation command to server...");

    try {
      await fetch(`${BACKEND_URL}/api/agent/${currentTask.id}/cancel`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
      });
    } catch (err) {
      console.error("Failed to send cancel command:", err);
    }

    if (socket) { try { socket.close(); } catch (e) { } }
    set((state) => ({
      currentTask: { ...state.currentTask, status: "failed" },
      agentStatus: { ...state.agentStatus, phase: "idle" },
      stepsPlan: state.stepsPlan.map((s) => (s.status === "active" ? { ...s, status: "failed" } : s)),
      socket: null,
    }));
    get().addTimelineEvent("error", "Agent", "Execution aborted by operator.");
  },

  approveNextStep: async () => {
    const { currentTask } = get();
    if (!currentTask || currentTask.status !== "waiting_approval") return;

    get().addTimelineEvent("info", "Checkpoint", "Submitting approval to agent runner...");

    try {
      console.log(`[useAgentStore] Hitting API /api/agent/${currentTask.id}/approve`);
      const response = await fetch(`${BACKEND_URL}/api/agent/${currentTask.id}/approve`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
      });
      console.log(`[useAgentStore] Response from /api/agent/${currentTask.id}/approve status: ${response.status}`);
      if (!response.ok) throw new Error(`HTTP error ${response.status}`);

      const data = await response.json();
      console.log(`[useAgentStore] Response data from /api/agent/${currentTask.id}/approve:`, data);

      set((state) => ({
        currentTask: { ...state.currentTask, status: "running" },
        agentStatus: { ...state.agentStatus, phase: "running", currentStepIndex: 4 },
        stepsPlan: state.stepsPlan.map((s) => {
          if (s.index === 3) return { ...s, status: "done" };
          if (s.index === 4) return { ...s, status: "active" };
          return s;
        }),
      }));

      get().addTimelineEvent("success", "Checkpoint", "Step approved. Agent resumed execution.");
    } catch (err) {
      get().addTimelineEvent("error", "Checkpoint", `Failed to submit approval: ${err.message}`);
    }
  },

  rejectStep: async () => {
    const { currentTask, socket } = get();
    if (!currentTask || currentTask.status !== "waiting_approval") return;

    get().addTimelineEvent("warning", "Checkpoint", "Submitting rejection to agent runner...");

    try {
      await fetch(`${BACKEND_URL}/api/agent/${currentTask.id}/reject`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
      });
    } catch (err) {
      console.error("Failed to send rejection command:", err);
    }

    if (socket) { try { socket.close(); } catch (e) { } }

    set((state) => ({
      currentTask: { ...state.currentTask, status: "failed" },
      agentStatus: { ...state.agentStatus, phase: "rejected" },
      stepsPlan: state.stepsPlan.map((s) => (s.index === 3 ? { ...s, status: "rejected" } : s)),
      socket: null,
    }));
    get().addTimelineEvent("error", "Checkpoint", "Checkpoint rejected by human operator. Execution stopped.");
  },

  addTimelineEvent: (status, badge, text, retryCount = 0) => {
    const newEvent = { id: Math.random().toString(36).substring(7), timestamp: new Date().toLocaleTimeString(), status, badge, text, retryCount };
    set((state) => ({ timeline: [...state.timeline, newEvent] }));
  },

  updateBrowser: (updates) => {
    set((state) => ({ browser: { ...state.browser, ...updates } }));
  },

  setActiveView: (view) => {
    set({ activeView: view });
  },

  resetTask: () => {
    const existingSocket = get().socket;
    if (existingSocket) { try { existingSocket.close(); } catch (e) { } }

    set({
      currentTask: null,
      agentStatus: { phase: "idle", currentStepIndex: 0, totalSteps: 0, tokensUsed: 0, executionTime: 0, retries: 0 },
      stepsPlan: [],
      timeline: [],
      browser: { url: "about:blank", isLoading: false, screenshot: null },
      results: [],
      socket: null,
    });
  },
}));