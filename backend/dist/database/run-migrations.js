"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const data_source_1 = require("./data-source");
async function run() {
    await data_source_1.default.initialize();
    await data_source_1.default.runMigrations({ transaction: 'all' });
    await data_source_1.default.destroy();
}
run().catch((error) => {
    console.error('Migration failed', error);
    process.exit(1);
});
//# sourceMappingURL=run-migrations.js.map