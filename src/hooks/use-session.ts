import { useState, useEffect } from "react";

const SESSION_KEY = "havenly_session";

export function useSession() {
  const [sessionId, setSessionId] = useState<string>("");

  useEffect(() => {
    let currentSession = localStorage.getItem(SESSION_KEY);
    if (!currentSession) {
      currentSession = crypto.randomUUID();
      localStorage.setItem(SESSION_KEY, currentSession);
    }
    setSessionId(currentSession);
  }, []);

  return { sessionId };
}
