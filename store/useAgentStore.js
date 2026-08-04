import { create } from "zustand";

/**
 * @typedef {Object} Task
 * @property {string} id
 * @property {string} prompt
 * @property {'idle' | 'running' | 'paused' | 'completed' | 'failed' | 'waiting_approval'} status
 * @property {string} createdAt
 */

/**
 * @typedef {Object} AgentStatus
 * @property {'idle' | 'navigating' | 'extracting' | 'analyzing' | 'waiting_approval' | 'done' | 'rejected' | 'running'} phase
 * @property {number} currentStepIndex
 * @property {number} totalSteps
 * @property {number} tokensUsed
 * @property {number} executionTime
 * @property {number} retries
 * @property {string} activeView
 */

/**
 * @typedef {Object} CurrentStep
 * @property {number} index
 * @property {string} description
 * @property {'pending' | 'active' | 'done' | 'failed' | 'rejected'} status
 */

/**
 * @typedef {Object} TimelineEvent
 * @property {string} id
 * @property {string} timestamp
 * @property {'success' | 'loading' | 'warning' | 'info' | 'error'} status
 * @property {string} badge
 * @property {string} text
 * @property {number} retryCount
 */

export const useAgentStore = create((set, get) => ({
  // --- STATE ---

  /** @type {Task | null} */
  currentTask: null,

  /** @type {AgentStatus} */
  agentStatus: {
    phase: "idle",
    currentStepIndex: 0,
    totalSteps: 0,
    tokensUsed: 0,
    executionTime: 0,
    retries: 0,
  },

  /** @type {CurrentStep[]} */
  stepsPlan: [],

  /** @type {TimelineEvent[]} */
  timeline: [],

  /** @type {Object} */
  browser: {
    url: "about:blank",
    isLoading: false,
    screenshot: null,
  },

  /** @type {Object[]} */
  results: [],

  /** @type {string} */
  activeView: "dashboard",

  /** @type {WebSocket | null} */
  socket: null,

  // --- ACTIONS ---

  setTask: (prompt) => {
    const newTask = {
      id: Math.random().toString(36).substring(7), // temporary local ID, overwritten by startAgent response
      prompt,
      status: "idle",
      createdAt: new Date().toISOString(),
    };

    // Close any open sockets first
    const existingSocket = get().socket;
    if (existingSocket) {
      try {
        existingSocket.close();
      } catch (e) { }
    }

    set({
      currentTask: newTask,
      agentStatus: {
        phase: "idle",
        currentStepIndex: 0,
        totalSteps: 4,
        tokensUsed: 0,
        executionTime: 0,
        retries: 0,
      },
      stepsPlan: [
        { index: 1, description: "Navigate to target site", status: "pending" },
        { index: 2, description: "Extract relevant job detail cards", status: "pending" },
        { index: 3, description: "Approve extraction list (Human Checkpoint)", status: "pending" },
        { index: 4, description: "Compile results and export database", status: "pending" },
      ],
      timeline: [],
      browser: {
        url: "about:blank",
        isLoading: false,
        screenshot: null,
      },
      results: [],
      socket: null,
    });
  },

  startAgent: async () => {
    const { currentTask } = get();
    if (!currentTask) return;

    set((state) => ({
      currentTask: { ...state.currentTask, status: "running" },
      agentStatus: { ...state.agentStatus, phase: "running", currentStepIndex: 1 },
      stepsPlan: state.stepsPlan.map((s) =>
        s.index === 1 ? { ...s, status: "active" } : s
      ),
    }));

    get().addTimelineEvent("info", "Agent", `Connecting to server and starting task: "${currentTask.prompt}"`);

    try {
      const response = await fetch("http://localhost:8000/api/agent/start", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ goal: currentTask.prompt }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }

      const data = await response.json();
      const taskId = data.task_id;

      set((state) => ({
        currentTask: { ...state.currentTask, id: taskId },
      }));

      // Establish WebSocket connection
      const ws = new WebSocket(`ws://localhost:8000/ws/agent/${taskId}`);

      ws.onopen = () => {
        get().addTimelineEvent("success", "Socket", "Live monitoring session established.");
      };

      ws.onmessage = (event) => {
        try {
          const parsed = JSON.parse(event.data);

          if (parsed.type === "screenshot_event") {
            const base64Img = parsed.screenshot;
            const imgSrc = base64Img.startsWith("data:")
              ? base64Img
              : `data:image/png;base64,${base64Img}`;

            set((state) => ({
              browser: {
                ...state.browser,
                screenshot: { url: imgSrc, timestamp: new Date().toISOString() },
                isLoading: false,
              }
            }));
          }

          if (parsed.type === "timeline_event") {
            const isApproval = parsed.event_type === "approval_required";

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

            const messageText = parsed.details?.message || parsed.message || JSON.stringify(parsed);
            const status = isApproval ? "warning" : (parsed.event_type === "error" ? "error" : "info");
            get().addTimelineEvent(status, parsed.event_type || "Agent", messageText);

            // Parse job listing if present in message
            if (messageText && messageText.includes("Scraped:")) {
              const scrapedPart = messageText.split("Scraped:")[1];
              const parts = scrapedPart.split("|").map(p => p.trim());
              if (parts.length >= 2) {
                const company = parts[0] || "Unknown";
                const role = parts[1] || "Software Engineer";
                const salary = parts[2] || "N/A";
                const location = parts[3] || "Remote";
                const directUrl = parts[4] || `https://www.google.com/search?q=${encodeURIComponent(company + ' ' + role)}`;

                const newJob = {
                  id: Math.random().toString(36).substring(7),
                  company,
                  role,
                  sal: salary,
                  loc: location,
                  exp: "3+ years",
                  match: Math.floor(Math.random() * 15) + 85,
                  url: directUrl
                };

                set((state) => ({
                  results: [...state.results, newJob]
                }));
              }
            }

            // Handle new graph results event containing real JSON data from backend
            if (parsed.event_type === "results") {
              const jobs = parsed.details?.data || [];
              const formattedJobs = jobs.map((job) => ({
                id: Math.random().toString(36).substring(7),
                company: job.company || "Unknown",
                role: job.title || job.role || "Software Engineer",
                sal: job.salary || "N/A",
                loc: job.location || "Remote",
                exp: "3+ years",
                match: Math.floor(Math.random() * 15) + 85,
                url: job.link || job.url || ""
              }));

              set({ results: formattedJobs });
            }
          }

          if (parsed.type === "status_update") {
            const apiStatus = parsed.status; // running, pending_approval, completed, failed

            set((state) => {
              let updatedStatus = state.currentTask.status;
              let phase = state.agentStatus.phase;
              let steps = [...state.stepsPlan];

              if (apiStatus === "pending_approval") {
                updatedStatus = "waiting_approval";
                phase = "waiting_approval";
                steps = steps.map((s) => {
                  if (s.index === 2) return { ...s, status: "done" };
                  if (s.index === 3) return { ...s, status: "active" };
                  return s;
                });
              } else if (apiStatus === "completed") {
                updatedStatus = "completed";
                phase = "done";
                steps = steps.map((s) => ({ ...s, status: "done" }));
              } else if (apiStatus === "failed") {
                updatedStatus = "failed";
                phase = "idle";
                steps = steps.map((s) => s.status === "active" ? { ...s, status: "failed" } : s);
              } else if (apiStatus === "running") {
                updatedStatus = "running";
                phase = "running";
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

      ws.onerror = (err) => {
        console.error("WebSocket error:", err);
        get().addTimelineEvent("error", "Socket", "WebSocket stream connection encountered an error.");
      };

      ws.onclose = () => {
        get().addTimelineEvent("info", "Socket", "WebSocket connection closed.");
      };

      set({ socket: ws });

    } catch (err) {
      console.error("Error starting agent run:", err);
      get().addTimelineEvent("error", "Agent", `Failed to start agent: ${err.message}`);
      set((state) => ({
        currentTask: { ...state.currentTask, status: "failed" },
        agentStatus: { ...state.agentStatus, phase: "idle" }
      }));
    }
  },

  pauseAgent: () => {
    // Local pause indicator since background agent runs automatically
    const { currentTask } = get();
    if (!currentTask || currentTask.status !== "running") return;

    set((state) => ({
      currentTask: { ...state.currentTask, status: "paused" },
    }));
    get().addTimelineEvent("warning", "Agent", "Agent paused locally.");
  },

  resumeAgent: () => {
    const { currentTask } = get();
    if (!currentTask || currentTask.status !== "paused") return;

    set((state) => ({
      currentTask: { ...state.currentTask, status: "running" },
    }));
    get().addTimelineEvent("info", "Agent", "Agent resumed locally.");
  },

  stopAgent: () => {
    const { currentTask, socket } = get();
    if (!currentTask) return;

    if (socket) {
      try {
        socket.close();
      } catch (e) { }
    }

    set((state) => ({
      currentTask: { ...state.currentTask, status: "failed" },
      agentStatus: { ...state.agentStatus, phase: "idle" },
      stepsPlan: state.stepsPlan.map(s =>
        s.status === "active" ? { ...s, status: "failed" } : s
      ),
      socket: null,
    }));
    get().addTimelineEvent("error", "Agent", "Execution aborted by operator.");
  },

  approveNextStep: async () => {
    const { currentTask } = get();
    if (!currentTask || currentTask.status !== "waiting_approval") return;

    get().addTimelineEvent("info", "Checkpoint", "Submitting approval to agent runner...");

    try {
      const response = await fetch(`http://localhost:8000/api/agent/${currentTask.id}/approve`, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }

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
      console.error("Failed to approve next step:", err);
      get().addTimelineEvent("error", "Checkpoint", `Failed to submit approval: ${err.message}`);
    }
  },

  rejectStep: () => {
    const { currentTask, socket } = get();
    if (!currentTask || currentTask.status !== "waiting_approval") return;

    if (socket) {
      try {
        socket.close();
      } catch (e) { }
    }

    set((state) => ({
      currentTask: { ...state.currentTask, status: "failed" },
      agentStatus: { ...state.agentStatus, phase: "rejected" },
      stepsPlan: state.stepsPlan.map((s) => {
        if (s.index === 3) return { ...s, status: "rejected" };
        return s;
      }),
      socket: null,
    }));

    get().addTimelineEvent("error", "Checkpoint", "Checkpoint rejected by human operator. Execution stopped.");
  },

  addTimelineEvent: (status, badge, text, retryCount = 0) => {
    const newEvent = {
      id: Math.random().toString(36).substring(7),
      timestamp: new Date().toLocaleTimeString(),
      status,
      badge,
      text,
      retryCount,
    };
    set((state) => ({ timeline: [...state.timeline, newEvent] }));
  },

  updateBrowser: (updates) => {
    set((state) => ({
      browser: { ...state.browser, ...updates },
    }));
  },

  setActiveView: (view) => {
    set({ activeView: view });
  },

  resetTask: () => {
    // Close any open sockets first
    const existingSocket = get().socket;
    if (existingSocket) {
      try {
        existingSocket.close();
      } catch (e) { }
    }

    set({
      currentTask: null,
      agentStatus: {
        phase: "idle",
        currentStepIndex: 0,
        totalSteps: 0,
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
      socket: null,
    });
  },
}));
