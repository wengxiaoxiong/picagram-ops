const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function listPersonas() {
  const personas = await prisma.persona.findMany({
    include: {
      posts: true,
      visualProfile: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  });
  
  console.log('=== 所有 Persona 列表 ===\n');
  
  for (const persona of personas) {
    console.log(`ID: ${persona.id}`);
    console.log(`名称: ${persona.displayName}`);
    console.log(`Slug: ${persona.slug}`);
    console.log(`状态: ${persona.status}`);
    console.log(`帖子数: ${persona.posts.length}`);
    console.log(`创建时间: ${persona.createdAt}`);
    console.log(`Bio: ${persona.bio?.substring(0, 100)}...`);
    console.log('---\n');
  }
  
  return personas;
}

async function deletePersona(personaId) {
  try {
    await prisma.persona.delete({
      where: { id: personaId }
    });
    console.log(`已删除 Persona: ${personaId}`);
    return true;
  } catch (error) {
    console.error(`删除失败: ${error.message}`);
    return false;
  }
}

async function listPosts() {
  const posts = await prisma.post.findMany({
    include: {
      persona: true
    },
    orderBy: {
      createdAt: 'desc'
    },
    take: 50
  });
  
  console.log('=== 最近 50 条帖子 ===\n');
  
  for (const post of posts) {
    console.log(`ID: ${post.id}`);
    console.log(`作者: ${post.persona?.displayName || 'Unknown'}`);
    console.log(`状态: ${post.status}`);
    console.log(`内容: ${post.caption?.substring(0, 100)}...`);
    console.log('---\n');
  }
  
  return posts;
}

async function deletePost(postId) {
  try {
    await prisma.post.delete({
      where: { id: postId }
    });
    console.log(`已删除 Post: ${postId}`);
    return true;
  } catch (error) {
    console.error(`删除失败: ${error.message}`);
    return false;
  }
}

async function main() {
  const command = process.argv[2];
  
  try {
    switch (command) {
      case 'list-personas':
        await listPersonas();
        break;
        
      case 'list-posts':
        await listPosts();
        break;
        
      case 'delete-persona':
        const personaId = process.argv[3];
        if (!personaId) {
          console.log('Usage: node db-ops.js delete-persona <personaId>');
          process.exit(1);
        }
        await deletePersona(personaId);
        break;
        
      case 'delete-post':
        const postId = process.argv[3];
        if (!postId) {
          console.log('Usage: node db-ops.js delete-post <postId>');
          process.exit(1);
        }
        await deletePost(postId);
        break;
        
      default:
        console.log(`
Database Operations Script

Usage:
  node db-ops.js <command> [options]

Commands:
  list-personas              列出所有 Persona
  list-posts                 列出最近 50 条帖子
  delete-persona <id>        删除指定 Persona
  delete-post <id>           删除指定帖子
`);
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
