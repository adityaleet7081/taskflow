import type { Task, User, Priority } from '../types';

export const USERS: User[] = [
  { id: 'u1', name: 'Alex Kim', color: '#6366f1' },
  { id: 'u2', name: 'Jamie Lee', color: '#8b5cf6' },
  { id: 'u3', name: 'Morgan Chen', color: '#ec4899' },
  { id: 'u4', name: 'Riley Park', color: '#14b8a6' },
  { id: 'u5', name: 'Sam Torres', color: '#f59e0b' },
  { id: 'u6', name: 'Jordan Wu', color: '#3b82f6' },
];

const TASK_TITLES: string[] = [
  'Implement OAuth login flow',
  'Fix mobile navigation bug',
  'Write API documentation',
  'Design onboarding flow',
  'Set up CI/CD pipeline',
  'Refactor database queries',
  'Add dark mode support',
  'Create user settings page',
  'Optimize image loading',
  'Build notification system',
  'Update payment integration',
  'Fix search indexing issue',
  'Add export to CSV feature',
  'Implement rate limiting',
  'Design email templates',
  'Set up error tracking',
  'Build admin dashboard',
  'Fix memory leak in workers',
  'Add two-factor authentication',
  'Create API versioning strategy',
  'Implement WebSocket connections',
  'Build file upload component',
  'Optimize database migrations',
  'Create user onboarding tour',
  'Fix timezone conversion bugs',
  'Add audit log functionality',
  'Build real-time chat feature',
  'Implement data caching layer',
  'Design system architecture review',
  'Fix cross-browser CSS issues',
  'Add keyboard shortcuts',
  'Build analytics dashboard',
  'Implement lazy loading for routes',
  'Create reusable form components',
  'Fix email delivery failures',
  'Add multi-language support',
  'Build role-based access control',
  'Optimize API response times',
  'Create automated backup system',
  'Fix session handling issues',
  'Add drag-and-drop file upload',
  'Build activity feed component',
  'Implement server-side rendering',
  'Create integration test suite',
  'Fix responsive layout breakpoints',
  'Add social media sharing',
  'Build invoice generation module',
  'Implement data export pipeline',
  'Create performance monitoring',
  'Fix WebSocket reconnection logic',
  'Add custom theme builder',
  'Build team management features',
  'Implement content moderation',
  'Create deployment documentation',
  'Fix OAuth token refresh flow',
  'Add batch processing support',
  'Build customer feedback widget',
  'Implement search autocomplete',
  'Create API health checks',
  'Fix image compression pipeline',
  'Add user profile customization',
  'Build notification preferences',
  'Implement data archival system',
  'Create load testing framework',
  'Fix concurrent update conflicts',
  'Add webhook management UI',
  'Build subscription billing page',
  'Implement feature flag system',
  'Create accessibility audit',
  'Fix PDF generation layout',
  'Add calendar view component',
  'Build report scheduling system',
  'Implement SSO integration',
  'Create API rate limit dashboard',
  'Fix mobile gesture handling',
  'Add bulk action support',
  'Build data visualization charts',
  'Implement log aggregation',
  'Create user segmentation tool',
  'Fix GraphQL schema conflicts',
  'Add progressive web app support',
  'Build comment threading system',
  'Implement cache invalidation',
  'Create security vulnerability scan',
  'Fix infinite scroll pagination',
  'Add custom field definitions',
  'Build workflow automation engine',
  'Implement database sharding',
  'Create end-to-end test coverage',
  'Fix Docker container networking',
];

const STATUSES = ['todo', 'in-progress', 'in-review', 'done'] as const;

const PRIORITY_WEIGHTS = [
  { priority: 'critical' as Priority, weight: 0.10 },
  { priority: 'high' as Priority, weight: 0.25 },
  { priority: 'medium' as Priority, weight: 0.40 },
  { priority: 'low' as Priority, weight: 0.25 },
];

function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function pickWeightedPriority(rand: () => number): Priority {
  const r = rand();
  let cumulative = 0;
  for (const { priority, weight } of PRIORITY_WEIGHTS) {
    cumulative += weight;
    if (r <= cumulative) return priority;
  }
  return 'medium';
}

function formatDateISO(date: Date): string {
  return date.toISOString().split('T')[0];
}

export function generateTasks(): Task[] {
  const rand = seededRandom(42);
  const tasks: Task[] = [];
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  for (let i = 0; i < 500; i++) {
    const titleIndex = i % TASK_TITLES.length;
    const variation = Math.floor(i / TASK_TITLES.length);
    const suffix = variation > 0 ? ` (v${variation + 1})` : '';
    const title = TASK_TITLES[titleIndex] + suffix;

    const assigneeId = USERS[Math.floor(rand() * USERS.length)].id;
    const priority = pickWeightedPriority(rand);
    const status = STATUSES[Math.floor(rand() * STATUSES.length)];

    let startDate: string | null = null;
    if (rand() < 0.70) {
      const daysAgo = Math.floor(rand() * 60);
      const sd = new Date(today);
      sd.setDate(sd.getDate() - daysAgo);
      startDate = formatDateISO(sd);
    }

    let dueDate: Date;
    if (i < 35) {
      if (i < 8) {
        const overdueDays = 8 + Math.floor(rand() * 13);
        dueDate = new Date(today);
        dueDate.setDate(dueDate.getDate() - overdueDays);
      } else {
        const overdueDays = 1 + Math.floor(rand() * 7);
        dueDate = new Date(today);
        dueDate.setDate(dueDate.getDate() - overdueDays);
      }
    } else if (i < 40) {
      dueDate = new Date(today);
    } else {
      const r = rand();
      if (r < 0.05) {
        const overdueDays = 1 + Math.floor(rand() * 15);
        dueDate = new Date(today);
        dueDate.setDate(dueDate.getDate() - overdueDays);
      } else if (r < 0.08) {
        dueDate = new Date(today);
      } else {
        const futureDays = 1 + Math.floor(rand() * 45);
        dueDate = new Date(today);
        dueDate.setDate(dueDate.getDate() + futureDays);
      }
    }

    const createdDaysAgo = Math.floor(rand() * 90) + 1;
    const createdAt = new Date(today);
    createdAt.setDate(createdAt.getDate() - createdDaysAgo);

    tasks.push({
      id: `task-${i + 1}`,
      title,
      assigneeId,
      priority,
      status,
      startDate,
      dueDate: formatDateISO(dueDate),
      createdAt: createdAt.toISOString(),
    });
  }

  return tasks;
}

export const TASKS: Task[] = generateTasks();