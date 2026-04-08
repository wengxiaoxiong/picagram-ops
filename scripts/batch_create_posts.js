const { execSync } = require('child_process');

// Top 10 personas
const personas = [
  'nova-lane',
  'a-vr-lane', 
  'oneironaut-a-lane',
  'orbital-scavenger-lane',
  'the-gentle-lane',
  'bug-detective-lane',
  'storm-rider-lane',
  'chronos-restorer-lane',
  'the-abyss-lane',
  'dr-laughtrack-lane'
];

const results = {
  success: [],
  failed: []
};

console.log(`[${new Date().toISOString()}] === Batch Creating Posts ===`);
console.log(`Total personas: ${personas.length}, Posts per persona: 6`);
console.log(`Total posts to create: ${personas.length * 6}`);
console.log('');

for (const persona of personas) {
  console.log(`\n[${new Date().toISOString()}] Creating posts for: ${persona}`);
  
  for (let i = 1; i <= 6; i++) {
    try {
      const output = execSync(`pgc post create --persona ${persona} 2>&1`, { 
        encoding: 'utf8',
        timeout: 60000
      });
      
      // Extract post ID from output
      const idMatch = output.match(/ID: ([a-z0-9]+)/);
      const postId = idMatch ? idMatch[1] : 'unknown';
      
      results.success.push({ persona, postId, round: i });
      console.log(`  ✓ [${i}/6] Created: ${postId}`);
      
      // Small delay between posts
      if (i < 6) {
        execSync('sleep 0.5');
      }
    } catch (error) {
      results.failed.push({ persona, round: i, error: error.message });
      console.log(`  ✗ [${i}/6] Failed: ${error.message}`);
    }
  }
}

console.log('\n');
console.log(`[${new Date().toISOString()}] === Batch Complete ===`);
console.log(`Success: ${results.success.length}`);
console.log(`Failed: ${results.failed.length}`);

if (results.failed.length > 0) {
  console.log('\nFailed items:');
  results.failed.forEach(f => console.log(`  - ${f.persona} [${f.round}/6]: ${f.error}`));
}

// Save report
const fs = require('fs');
const reportPath = `/root/picagram-ops/reports/batch-posts-${new Date().toISOString().split('T')[0]}.json`;
fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));
console.log(`\nReport saved to: ${reportPath}`);
