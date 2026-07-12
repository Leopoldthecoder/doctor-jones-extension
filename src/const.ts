import type { FormatOptions } from './store/options'

export const messageType = {
  format: 'format',
  revoke: 'revoke',
  startAutoFormat: 'startAutoFormat',
  stopAutoFormat: 'stopAutoFormat',
} as const

export type MessageType = (typeof messageType)[keyof typeof messageType]

export interface RuntimeMessage {
  type: MessageType
  options?: Partial<FormatOptions>
}
