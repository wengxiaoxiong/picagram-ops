#!/usr/bin/env node
/**
 * 移除 Persona 名称中的 "Lane" 后缀
 */

const INTERNAL_API_KEY = process.env.INTERNAL_API_KEY || 'dev-internal-key';
const BASE_URL = process.env.PICAGRAM_URL || 'http://localhost:3000';

// 带 Lane 的 persona 列表（从 pgc persona list 获取）
const LANE_PERSONAS = [
  { id: 'cmnnus9yw000104kyv6ii85np', name: 'Nova Lane', newName: 'Nova' },
  { id: 'cmnnix827000004l5k7mwdwhx', name: 'A VR Lane', newName: 'A VR' },
  { id: 'cmnni7b1q001604jv4s4nnxi0', name: 'Oneironaut A Lane', newName: 'Oneironaut A' },
  { id: 'cmnni788d001404jvsg1ba3ah', name: 'Orbital Scavenger Lane', newName: 'Orbital Scavenger' },
  { id: 'cmnni75or001204jvsqsh0tz8', name: 'The Gentle Lane', newName: 'The Gentle' },
  { id: 'cmnni72rw000x04jvtkhehat7', name: 'Bug Detective Lane', newName: 'Bug Detective' },
  { id: 'cmnni7lyq001l04jvoafahp4d', name: 'Storm Rider Lane', newName: 'Storm Rider' },
  { id: 'cmnni7kwr001i04jv14dxk3u2', name: 'Chronos Restorer Lane', newName: 'Chronos Restorer' },
  { id: 'cmnni7jyu001f04jvzndpwt45', name: 'The Abyss Lane', newName: 'The Abyss' },
  { id: 'cmnni7e09001c04jvgl8r6l3j', name: 'Dr LaughTrack Lane', newName: 'Dr LaughTrack' },
  { id: 'cmnni7blk001904jv719xhqrl', name: 'Agent Croissant Lane', newName: 'Agent Croissant' },
  { id: 'cmnni74j5001004jvj4pwxcx5', name: 'Quantum Baller Lane', newName: 'Quantum Baller' },
];

async function updatePersonaName(personaId, newName) {
  const response = await fetch(`${BASE_URL}/api/internal/personas/${personaId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'x-internal-key': INTERNAL_API_KEY,
    },
    body: JSON.stringify({ displayName: newName }),
  });

  const result = await response.json();
  return result.ok;
}

async function main() {
  console.log('🧹 移除 Persona 名称中的 "Lane" 后缀...\n');

  let successCount = 0;
  let failCount = 0;

  for (const persona of LANE_PERSONAS) {
    console.log(`更新: ${persona.name} → ${persona.newName}`);
    const success = await updatePersonaName(persona.id, persona.newName);
    if (success) {
      console.log('  ✅ 成功');
      successCount++;
    } else {
      console.log('  ❌ 失败');
      failCount++;
    }
    await new Promise(r => setTimeout(r, 300));
  }

  console.log(`\n✅ 完成！成功: ${successCount}, 失败: ${failCount}`);
}

main().catch(console.error);
