/**
 * Database Seed Script
 * Creates demo admin + user accounts and sample tasks
 * Run with: node prisma/seed.js
 */

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

const SALT_ROUNDS = 12;

async function main() {
  console.log('🌱 Seeding database...');

  // Create admin user
  const adminPassword = await bcrypt.hash('Admin@1234', SALT_ROUNDS);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@taskflow.com' },
    update: {},
    create: {
      name: 'Admin User',
      email: 'admin@taskflow.com',
      password: adminPassword,
      role: 'ADMIN',
    },
  });
  console.log(`✅ Admin created: ${admin.email}`);

  // Create demo user
  const userPassword = await bcrypt.hash('User@1234', SALT_ROUNDS);
  const user = await prisma.user.upsert({
    where: { email: 'demo@taskflow.com' },
    update: {},
    create: {
      name: 'Demo User',
      email: 'demo@taskflow.com',
      password: userPassword,
      role: 'USER',
    },
  });
  console.log(`✅ Demo user created: ${user.email}`);

  // Create sample tasks
  const tasksData = [
    {
      title: 'Design new landing page',
      description: 'Create wireframes and high-fidelity mockups for the marketing site redesign.',
      status: 'IN_PROGRESS',
      priority: 'HIGH',
      tags: JSON.stringify(['design', 'marketing']),
      creatorId: admin.id,
      assigneeId: user.id,
      dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      order: 0,
    },
    {
      title: 'Set up CI/CD pipeline',
      description: 'Configure GitHub Actions for automated testing and deployment.',
      status: 'TODO',
      priority: 'HIGH',
      tags: JSON.stringify(['devops', 'automation']),
      creatorId: admin.id,
      assigneeId: admin.id,
      dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      order: 1,
    },
    {
      title: 'Write API documentation',
      description: 'Document all REST endpoints using OpenAPI/Swagger specification.',
      status: 'TODO',
      priority: 'MEDIUM',
      tags: JSON.stringify(['docs', 'api']),
      creatorId: user.id,
      assigneeId: user.id,
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      order: 2,
    },
    {
      title: 'Fix login page mobile layout',
      description: 'The login form breaks on screens smaller than 375px.',
      status: 'TODO',
      priority: 'LOW',
      tags: JSON.stringify(['bug', 'mobile']),
      creatorId: user.id,
      dueDate: null,
      order: 3,
    },
    {
      title: 'Implement dark mode',
      description: 'Add CSS variable-based dark mode toggle that persists in localStorage.',
      status: 'COMPLETED',
      priority: 'MEDIUM',
      tags: JSON.stringify(['frontend', 'ui']),
      creatorId: admin.id,
      assigneeId: user.id,
      dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      order: 0,
    },
    {
      title: 'Database performance audit',
      description: 'Review slow queries and add missing indexes.',
      status: 'COMPLETED',
      priority: 'HIGH',
      tags: JSON.stringify(['backend', 'performance']),
      creatorId: admin.id,
      assigneeId: admin.id,
      dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      order: 1,
    },
  ];

  for (const task of tasksData) {
    const created = await prisma.task.create({ data: task });

    // Add initial activity log
    await prisma.activityLog.create({
      data: {
        taskId: created.id,
        userId: task.creatorId,
        action: 'created',
        metadata: JSON.stringify({ title: created.title }),
      },
    });
  }

  console.log(`✅ Created ${tasksData.length} sample tasks`);
  console.log('\n🎉 Seed complete!\n');
  console.log('Demo accounts:');
  console.log('  Admin: admin@taskflow.com / Admin@1234');
  console.log('  User:  demo@taskflow.com  / User@1234\n');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
