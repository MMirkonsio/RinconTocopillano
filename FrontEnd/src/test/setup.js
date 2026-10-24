// Preparación del entorno de tests (jsdom no trae algunas APIs del navegador)
import { afterEach, vi } from "vitest";
import { cleanup } from "@testing-library/react";

afterEach(() => {
  cleanup();
  localStorage.clear();
});

window.matchMedia ??= (consulta) => ({
  matches: false,
  media: consulta,
  addEventListener: () => {},
  removeEventListener: () => {},
});
window.scrollTo = vi.fn();
Element.prototype.scrollTo ??= function () {};
