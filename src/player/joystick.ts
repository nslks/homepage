// Transient thumb input, read by the player each frame; never persisted.
export const joystick = { x: 0, y: 0 }

export function resetJoystick() {
  joystick.x = 0
  joystick.y = 0
}
