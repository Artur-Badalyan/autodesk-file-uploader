// small helpers shared between components
export function makeId() {
  return 'id_' + Math.random().toString(36).slice(2, 9);
}