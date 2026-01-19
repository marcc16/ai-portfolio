#!/usr/bin/env node

/**
 * Reset Rate Limits Tool (Node.js)
 * Usage: npm run reset-limits [-- [option] [value]]
 */

// Parse command line arguments
const args = process.argv.slice(2);
const action = args[0] || 'current';
const value = args[1] || '';

const BASE_URL = 'http://localhost:3000';
const ENDPOINT = '/api/dev/reset-limits';

// Colors for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  blue: '\x1b[34m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m'
};

function colorize(text, color) {
  return `${colors[color]}${text}${colors.reset}`;
}

async function makeRequest(url, description) {
  console.log(colorize('\n=====================================', 'cyan'));
  console.log(colorize('   Rate Limits Reset Tool', 'cyan'));
  console.log(colorize('=====================================\n', 'cyan'));
  console.log(colorize(`→ ${description}`, 'yellow'));
  console.log(colorize(`URL: ${url}\n`, 'blue'));

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.success) {
      console.log(colorize('✓ Response:', 'green'));
      console.log(JSON.stringify(data, null, 2));
    } else {
      console.log(colorize('✗ Error:', 'red'));
      console.log(JSON.stringify(data, null, 2));
    }

    console.log(colorize('\n=====================================\n', 'cyan'));
    return data;
  } catch (error) {
    console.log(colorize(`✗ Request failed: ${error.message}`, 'red'));
    console.log(colorize('\n⚠️  Make sure your dev server is running (npm run dev)\n', 'yellow'));
    throw error;
  }
}

async function main() {
  let url = '';
  let description = '';

  switch (action) {
    case 'current':
      url = `${BASE_URL}${ENDPOINT}`;
      description = 'Resetting current user/IP limits';
      break;

    case 'all':
      url = `${BASE_URL}${ENDPOINT}?all=true`;
      description = 'Resetting ALL limits (guests + users)';
      break;

    case 'user':
      if (!value) {
        console.error(colorize('Error: userId required', 'red'));
        console.log('Usage: npm run reset-limits -- user <userId>');
        console.log('Example: npm run reset-limits -- user user_2abc123');
        process.exit(1);
      }
      url = `${BASE_URL}${ENDPOINT}?userId=${value}`;
      description = `Resetting limits for user: ${value}`;
      break;

    case 'ip':
      if (!value) {
        console.error(colorize('Error: IP address required', 'red'));
        console.log('Usage: npm run reset-limits -- ip <ip_address>');
        console.log('Example: npm run reset-limits -- ip 192.168.1.1');
        process.exit(1);
      }
      url = `${BASE_URL}${ENDPOINT}?ip=${value}`;
      description = `Resetting limits for IP: ${value}`;
      break;

    case 'pattern':
      if (!value) {
        console.error(colorize('Error: Redis pattern required', 'red'));
        console.log('Usage: npm run reset-limits -- pattern <pattern>');
        console.log("Example: npm run reset-limits -- pattern 'messages:user:*'");
        process.exit(1);
      }
      url = `${BASE_URL}${ENDPOINT}?pattern=${encodeURIComponent(value)}`;
      description = `Resetting limits matching pattern: ${value}`;
      break;

    case 'help':
    case '-h':
    case '--help':
      console.log('\nUsage: npm run reset-limits [-- [option] [value]]\n');
      console.log('Options:');
      console.log('  current          Reset current user/IP limits (default)');
      console.log('  all              Reset ALL limits (guests + users)');
      console.log('  user <userId>    Reset specific Clerk user limits');
      console.log('  ip <ip>          Reset specific guest IP limits');
      console.log('  pattern <pat>    Reset using Redis pattern');
      console.log('  help             Show this help message\n');
      console.log('Examples:');
      console.log('  npm run reset-limits                                   # Reset current user');
      console.log('  npm run reset-limits -- all                            # Reset everything');
      console.log('  npm run reset-limits -- user user_2abc123xyz           # Reset specific user');
      console.log('  npm run reset-limits -- ip 192.168.1.1                 # Reset specific IP');
      console.log("  npm run reset-limits -- pattern 'messages:user:*'      # Reset all user messages\n");
      process.exit(0);
      break;

    default:
      console.error(colorize(`Error: Unknown option '${action}'`, 'red'));
      console.log("Run 'npm run reset-limits -- help' for usage information");
      process.exit(1);
  }

  try {
    await makeRequest(url, description);
  } catch (error) {
    process.exit(1);
  }
}

main();
