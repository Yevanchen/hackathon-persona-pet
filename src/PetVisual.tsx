import { useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent } from "react";
import type { Persona } from "./personas";

const petStates = {
  idle: { row: 0, frames: 6, durationMs: 1100 },
  "running-right": { row: 1, frames: 8, durationMs: 1060 },
  "running-left": { row: 2, frames: 8, durationMs: 1060 },
  waving: { row: 3, frames: 4, durationMs: 700 },
  jumping: { row: 4, frames: 5, durationMs: 840 },
  running: { row: 7, frames: 6, durationMs: 820 },
} as const;

type PetState = keyof typeof petStates;
type Position = { x: number; y: number };
type Drag = {
  pointerId: number;
  startX: number;
  startY: number;
  lastX: number;
  lastY: number;
  origin: Position;
  bounds: Position;
  moved: boolean;
};

const clamp = (value: number, limit: number) => Math.max(-limit, Math.min(limit, value));

export function PetVisual({ persona }: { persona: Persona }) {
  const stageRef = useRef<HTMLDivElement>(null);
  const petRef = useRef<HTMLButtonElement>(null);
  const dragRef = useRef<Drag | null>(null);
  const hoveredRef = useRef(false);
  const suppressClickRef = useRef(false);
  const [petState, setPetState] = useState<PetState>("idle");
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const state = petStates[petState];

  function bounds() {
    const stage = stageRef.current?.getBoundingClientRect();
    const pet = petRef.current?.getBoundingClientRect();
    return {
      x: Math.max(0, ((stage?.width ?? 0) - (pet?.width ?? 0)) / 2 - 8),
      y: Math.max(0, ((stage?.height ?? 0) - (pet?.height ?? 0)) / 2 - 8),
    };
  }

  function startDrag(event: PointerEvent<HTMLButtonElement>) {
    if (event.button !== 0) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      lastX: event.clientX,
      lastY: event.clientY,
      origin: position,
      bounds: bounds(),
      moved: false,
    };
    setIsDragging(true);
    setPetState("running");
  }

  function moveDrag(event: PointerEvent<HTMLButtonElement>) {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;

    const dx = event.clientX - drag.startX;
    const dy = event.clientY - drag.startY;
    const stepX = event.clientX - drag.lastX;
    const stepY = event.clientY - drag.lastY;
    drag.lastX = event.clientX;
    drag.lastY = event.clientY;
    drag.moved ||= Math.hypot(dx, dy) > 4;

    setPosition({
      x: clamp(drag.origin.x + dx, drag.bounds.x),
      y: clamp(drag.origin.y + dy, drag.bounds.y),
    });

    if (Math.abs(stepX) >= Math.abs(stepY) && Math.abs(stepX) > 0.5) {
      setPetState(stepX < 0 ? "running-left" : "running-right");
    } else if (Math.abs(stepY) > 0.5) {
      setPetState("running");
    }
  }

  function finishDrag(event: PointerEvent<HTMLButtonElement>, cancelled = false) {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    suppressClickRef.current = cancelled ? false : drag.moved;
    dragRef.current = null;
    setIsDragging(false);
    setPetState(cancelled ? "idle" : drag.moved ? "waving" : "idle");
  }

  function nudge(event: KeyboardEvent<HTMLButtonElement>) {
    const directions: Partial<Record<string, Position>> = {
      ArrowLeft: { x: -16, y: 0 },
      ArrowRight: { x: 16, y: 0 },
      ArrowUp: { x: 0, y: -16 },
      ArrowDown: { x: 0, y: 16 },
    };
    const direction = directions[event.key];
    if (!direction) return;
    event.preventDefault();
    const limit = bounds();
    setPosition((current) => ({
      x: clamp(current.x + direction.x, limit.x),
      y: clamp(current.y + direction.y, limit.y),
    }));
    setPetState(direction.x < 0 ? "running-left" : direction.x > 0 ? "running-right" : "running");
  }

  function finishJump() {
    if (petState === "jumping") setPetState(hoveredRef.current ? "waving" : "idle");
  }

  const stageStyle = { "--pet-color": persona.color } as CSSProperties;
  const spriteStyle = {
    "--pet-image": `url("${persona.petSprite}")`,
    "--pet-row": state.row,
    "--pet-frames": state.frames,
    "--pet-duration": `${state.durationMs}ms`,
    "--pet-x": `${position.x}px`,
    "--pet-y": `${position.y}px`,
  } as CSSProperties;

  return (
    <div ref={stageRef} className="pet-stage" style={stageStyle}>
      <span className="pet-stage-hint" id="pet-interaction-hint">
        可拖动 · 悬停有反应
      </span>
      <button
        ref={petRef}
        className="pet-dragger"
        type="button"
        data-dragging={isDragging}
        data-state={petState}
        style={spriteStyle}
        aria-label={`${persona.chinese}动画宠物；拖动或使用方向键移动，点击可跳跃`}
        aria-describedby="pet-interaction-hint"
        onPointerDown={startDrag}
        onPointerMove={moveDrag}
        onPointerUp={(event) => finishDrag(event)}
        onPointerCancel={(event) => finishDrag(event, true)}
        onPointerEnter={() => {
          hoveredRef.current = true;
          if (!dragRef.current) setPetState("waving");
        }}
        onPointerLeave={() => {
          hoveredRef.current = false;
          if (!dragRef.current) setPetState("idle");
        }}
        onClick={() => {
          if (suppressClickRef.current) {
            suppressClickRef.current = false;
            return;
          }
          setPetState("jumping");
        }}
        onKeyDown={nudge}
        onBlur={() => setPetState("idle")}
      >
        <span
          key={petState}
          className="pet-sprite"
          aria-hidden="true"
          onAnimationEnd={finishJump}
          onAnimationIteration={finishJump}
        />
      </button>
    </div>
  );
}
