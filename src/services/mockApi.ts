import { v4 as uuidv4 } from 'uuid';

// Types
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface Room {
  id: string;
  code: string;
  language: string;
  participants: User[];
  createdAt: Date;
  createdBy: string;
}

export interface CodeExecutionResult {
  output: string;
  error?: string;
  executionTime: number;
}

// Mock data storage
const mockRooms: Map<string, Room> = new Map();
const mockUsers: Map<string, User> = new Map();
let currentUser: User | null = null;

// Simulated network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock WebSocket subscribers for real-time updates
type CodeUpdateCallback = (code: string, userId: string) => void;
const codeSubscribers: Map<string, CodeUpdateCallback[]> = new Map();

// ============ Authentication API ============

export const authApi = {
  login: async (email: string, password: string): Promise<User> => {
    await delay(800);
    
    // Mock validation
    if (!email.includes('@') || password.length < 6) {
      throw new Error('Invalid credentials');
    }
    
    const user: User = {
      id: uuidv4(),
      name: email.split('@')[0],
      email,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
    };
    
    mockUsers.set(user.id, user);
    currentUser = user;
    localStorage.setItem('currentUser', JSON.stringify(user));
    
    return user;
  },

  register: async (name: string, email: string, password: string): Promise<User> => {
    await delay(800);
    
    if (!email.includes('@') || password.length < 6) {
      throw new Error('Invalid registration data');
    }
    
    const user: User = {
      id: uuidv4(),
      name,
      email,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
    };
    
    mockUsers.set(user.id, user);
    currentUser = user;
    localStorage.setItem('currentUser', JSON.stringify(user));
    
    return user;
  },

  logout: async (): Promise<void> => {
    await delay(300);
    currentUser = null;
    localStorage.removeItem('currentUser');
  },

  getCurrentUser: (): User | null => {
    if (currentUser) return currentUser;
    
    const stored = localStorage.getItem('currentUser');
    if (stored) {
      currentUser = JSON.parse(stored);
      return currentUser;
    }
    return null;
  },
};

// ============ Room API ============

export const roomApi = {
  createRoom: async (): Promise<Room> => {
    await delay(500);
    
    const user = authApi.getCurrentUser();
    if (!user) {
      throw new Error('User must be authenticated to create a room');
    }
    
    const room: Room = {
      id: uuidv4().slice(0, 8),
      code: '// Welcome to CodeCollab!\n// Start coding here...\n\nfunction greet(name) {\n  return `Hello, ${name}!`;\n}\n\nconsole.log(greet("World"));',
      language: 'javascript',
      participants: [user],
      createdAt: new Date(),
      createdBy: user.id,
    };
    
    mockRooms.set(room.id, room);
    return room;
  },

  joinRoom: async (roomId: string): Promise<Room> => {
    await delay(400);
    
    const user = authApi.getCurrentUser();
    if (!user) {
      throw new Error('User must be authenticated to join a room');
    }
    
    let room = mockRooms.get(roomId);
    
    // Create room if it doesn't exist (for demo purposes)
    if (!room) {
      room = {
        id: roomId,
        code: '// Welcome to CodeCollab!\n// Start coding here...\n\nfunction greet(name) {\n  return `Hello, ${name}!`;\n}\n\nconsole.log(greet("World"));',
        language: 'javascript',
        participants: [],
        createdAt: new Date(),
        createdBy: user.id,
      };
      mockRooms.set(roomId, room);
    }
    
    // Add user to participants if not already there
    if (!room.participants.find(p => p.id === user.id)) {
      room.participants.push(user);
    }
    
    return room;
  },

  leaveRoom: async (roomId: string): Promise<void> => {
    await delay(200);
    
    const user = authApi.getCurrentUser();
    const room = mockRooms.get(roomId);
    
    if (room && user) {
      room.participants = room.participants.filter(p => p.id !== user.id);
    }
  },

  getRoom: async (roomId: string): Promise<Room | null> => {
    await delay(200);
    return mockRooms.get(roomId) || null;
  },

  updateCode: async (roomId: string, code: string): Promise<void> => {
    const room = mockRooms.get(roomId);
    if (room) {
      room.code = code;
      
      // Notify all subscribers (simulating real-time updates)
      const user = authApi.getCurrentUser();
      const subscribers = codeSubscribers.get(roomId) || [];
      subscribers.forEach(callback => callback(code, user?.id || ''));
    }
  },

  updateLanguage: async (roomId: string, language: string): Promise<void> => {
    await delay(100);
    const room = mockRooms.get(roomId);
    if (room) {
      room.language = language;
    }
  },

  subscribeToCodeUpdates: (roomId: string, callback: CodeUpdateCallback): (() => void) => {
    const subscribers = codeSubscribers.get(roomId) || [];
    subscribers.push(callback);
    codeSubscribers.set(roomId, subscribers);
    
    return () => {
      const subs = codeSubscribers.get(roomId) || [];
      codeSubscribers.set(roomId, subs.filter(cb => cb !== callback));
    };
  },
};

// ============ Code Execution API ============

export const codeApi = {
  execute: async (code: string, language: string): Promise<CodeExecutionResult> => {
    await delay(500);
    
    const startTime = performance.now();
    
    if (language === 'javascript') {
      try {
        // Capture console.log output
        const logs: string[] = [];
        const originalLog = console.log;
        console.log = (...args) => {
          logs.push(args.map(arg => 
            typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
          ).join(' '));
        };
        
        // Execute the code
        const result = eval(code);
        
        // Restore console.log
        console.log = originalLog;
        
        const output = logs.length > 0 
          ? logs.join('\n') 
          : result !== undefined 
            ? String(result) 
            : 'Code executed successfully (no output)';
        
        return {
          output,
          executionTime: performance.now() - startTime,
        };
      } catch (error: any) {
        return {
          output: '',
          error: error.message || 'Execution error',
          executionTime: performance.now() - startTime,
        };
      }
    }
    
    // Mock execution for other languages
    return {
      output: `[Mock] Code execution for ${language} is simulated.\nYour code would run here in a real environment.`,
      executionTime: performance.now() - startTime,
    };
  },
};

// ============ Supported Languages ============

export const SUPPORTED_LANGUAGES = [
  { id: 'javascript', name: 'JavaScript', extension: 'js' },
  { id: 'typescript', name: 'TypeScript', extension: 'ts' },
  { id: 'python', name: 'Python', extension: 'py' },
  { id: 'java', name: 'Java', extension: 'java' },
  { id: 'cpp', name: 'C++', extension: 'cpp' },
  { id: 'csharp', name: 'C#', extension: 'cs' },
  { id: 'go', name: 'Go', extension: 'go' },
  { id: 'rust', name: 'Rust', extension: 'rs' },
] as const;

export type SupportedLanguage = typeof SUPPORTED_LANGUAGES[number]['id'];
