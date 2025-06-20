import { promises as fs } from 'fs';
import { join, dirname } from 'path';
import { logger } from './logger';

/**
 * Writes data to a file safely using an atomic operation pattern.
 * First writes to a temporary file, then renames it to the target file.
 * 
 * @param filePath - The target file path
 * @param data - The data to write
 * @returns Promise that resolves when the write is complete
 */
export async function writeFileSafe(filePath: string, data: string | Buffer): Promise<void> {
  const tempPath = `${filePath}.tmp`;
  
  try {
    // Ensure the directory exists
    await fs.mkdir(dirname(filePath), { recursive: true });
    
    // Write to temporary file
    await fs.writeFile(tempPath, data);
    
    // Atomically rename temp file to target file
    await fs.rename(tempPath, filePath);
    
    logger.debug(`File written successfully: ${filePath}`);
  } catch (error) {
    // Clean up temp file if it exists
    try {
      await fs.unlink(tempPath);
    } catch {
      // Ignore error if temp file doesn't exist
    }
    
    logger.error(`Error writing file ${filePath}:`, error);
    throw error;
  }
}
