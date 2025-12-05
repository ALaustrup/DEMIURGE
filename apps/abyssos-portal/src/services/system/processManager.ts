/**
 * Process Manager
 * 
 * System process supervisor for AbyssOS background tasks
 */

export type ProcessType = 'listener' | 'wasm' | 'task' | 'sync';
export type ProcessStatus = 'running' | 'sleeping' | 'dead' | 'stopped';

export interface Process {
  pid: number;
  name: string;
  type: ProcessType;
  status: ProcessStatus;
  cpuUsage: number; // 0-100
  memoryUsage: number; // bytes
  startedAt: number;
  onStop?: () => void;
  onStart?: () => void;
}

class ProcessManager {
  private processes: Map<number, Process> = new Map();
  private nextPid = 1;
  private updateInterval: ReturnType<typeof setInterval> | null = null;
  private listeners: Set<(processes: Process[]) => void> = new Set();
  
  /**
   * Start process manager
   */
  start(): void {
    // Update process stats every second
    this.updateInterval = setInterval(() => {
      this.updateProcessStats();
      this.notifyListeners();
    }, 1000);
  }
  
  /**
   * Stop process manager
   */
  stop(): void {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
  }
  
  /**
   * Spawn a new process
   */
  spawn(
    name: string,
    type: ProcessType,
    onStart?: () => void,
    onStop?: () => void
  ): number {
    const pid = this.nextPid++;
    
    const process: Process = {
      pid,
      name,
      type,
      status: 'running',
      cpuUsage: 0,
      memoryUsage: 0,
      startedAt: Date.now(),
      onStart,
      onStop,
    };
    
    this.processes.set(pid, process);
    
    if (onStart) {
      try {
        onStart();
      } catch (error) {
        console.error(`Process ${pid} (${name}) start error:`, error);
        process.status = 'dead';
      }
    }
    
    this.notifyListeners();
    return pid;
  }
  
  /**
   * Kill a process
   */
  kill(pid: number): boolean {
    const process = this.processes.get(pid);
    if (!process) return false;
    
    if (process.status === 'dead' || process.status === 'stopped') {
      return false;
    }
    
    if (process.onStop) {
      try {
        process.onStop();
      } catch (error) {
        console.error(`Process ${pid} stop error:`, error);
      }
    }
    
    process.status = 'stopped';
    this.notifyListeners();
    
    // Remove after a delay
    setTimeout(() => {
      this.processes.delete(pid);
      this.notifyListeners();
    }, 1000);
    
    return true;
  }
  
  /**
   * Restart a process
   */
  restart(pid: number): boolean {
    const process = this.processes.get(pid);
    if (!process) return false;
    
    // Stop first
    if (process.status === 'running') {
      this.kill(pid);
    }
    
    // Wait a bit, then restart
    setTimeout(() => {
      process.status = 'running';
      process.startedAt = Date.now();
      process.cpuUsage = 0;
      process.memoryUsage = 0;
      
      if (process.onStart) {
        try {
          process.onStart();
        } catch (error) {
          console.error(`Process ${pid} restart error:`, error);
          process.status = 'dead';
        }
      }
      
      this.notifyListeners();
    }, 500);
    
    return true;
  }
  
  /**
   * Get all processes
   */
  list(): Process[] {
    return Array.from(this.processes.values());
  }
  
  /**
   * Get process by PID
   */
  get(pid: number): Process | undefined {
    return this.processes.get(pid);
  }
  
  /**
   * Update process statistics
   */
  private updateProcessStats(): void {
    // Simulate CPU and memory usage
    // In a real implementation, this would query actual system metrics
    this.processes.forEach(process => {
      if (process.status === 'running') {
        // Simulate CPU usage (0-50% for most processes)
        process.cpuUsage = Math.random() * 50;
        
        // Simulate memory usage (1-100 MB)
        process.memoryUsage = Math.random() * 100 * 1024 * 1024;
      } else {
        process.cpuUsage = 0;
        process.memoryUsage = 0;
      }
    });
  }
  
  /**
   * Subscribe to process updates
   */
  onUpdate(callback: (processes: Process[]) => void): () => void {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }
  
  /**
   * Notify all listeners
   */
  private notifyListeners(): void {
    const processes = this.list();
    this.listeners.forEach(callback => {
      try {
        callback(processes);
      } catch (error) {
        console.error('Process listener error:', error);
      }
    });
  }
  
  /**
   * Get total CPU usage
   */
  getTotalCpuUsage(): number {
    return this.list()
      .filter(p => p.status === 'running')
      .reduce((sum, p) => sum + p.cpuUsage, 0);
  }
  
  /**
   * Get total memory usage
   */
  getTotalMemoryUsage(): number {
    return this.list()
      .filter(p => p.status === 'running')
      .reduce((sum, p) => sum + p.memoryUsage, 0);
  }
}

// Singleton instance
export const processManager = new ProcessManager();

// Start on module load
if (typeof window !== 'undefined') {
  processManager.start();
}

