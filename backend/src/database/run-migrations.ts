import dataSource from './data-source';

async function run() {
  await dataSource.initialize();
  await dataSource.runMigrations({ transaction: 'all' });
  await dataSource.destroy();
}

run().catch((error) => {
  console.error('Migration failed', error);
  process.exit(1);
});
