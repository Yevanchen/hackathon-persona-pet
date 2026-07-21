import { personaIds, type PersonaId } from "./personas.ts";

export type ResultLink = {
  personaId: PersonaId;
  sessionId: string;
};

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function createResultPath({ personaId, sessionId }: ResultLink) {
  const params = new URLSearchParams({ result: sessionId, persona: personaId });
  return `/?${params.toString()}`;
}

export function parseResultLink(search: string): ResultLink | null {
  const params = new URLSearchParams(search);
  const personaId = personaIds.find((id) => id === params.get("persona"));
  const sessionId = params.get("result");

  if (!personaId || !sessionId || !UUID_PATTERN.test(sessionId)) return null;

  return { personaId, sessionId };
}
