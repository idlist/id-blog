import { basename, extname } from 'path'

/**
 * Do nothing, literally.
 */
export const noop = (): void => { /* Do nothing */ }

/**
 * @param name Filename
 * @returns Filename without extension
 */
export const filename = (name: string): string => basename(name, extname(name))