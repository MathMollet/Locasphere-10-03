import { applicationService } from '../src/services/applicationService';

async function main() {
  try {
    applicationService.clearAllApplications();
    console.log('✅ All applications have been cleared successfully');
  } catch (error) {
    console.error('❌ Error clearing applications:', error);
    process.exit(1);
  }
}

main();