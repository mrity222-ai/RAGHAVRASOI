import fs from 'fs';
import { execSync } from 'child_process';

console.log('--- Generating Full MySQL Database Dump ---');

// 1. Get DDL
const ddl = execSync('npx prisma migrate diff --from-empty --to-schema-datamodel prisma/schema.prisma --script', {
  encoding: 'utf-8',
});

// 2. Read seed-raghav-menu.js to extract data
const seedCode = fs.readFileSync('scripts/seed-raghav-menu.js', 'utf-8');

// Parse CATEGORIES_DATA and PRODUCTS_DATA
const catMatch = seedCode.match(/const CATEGORIES_DATA = (\[[\s\S]*?\]);\r?\n\r?\nconst PRODUCTS_DATA/);
const prodMatch = seedCode.match(/const PRODUCTS_DATA = (\[[\s\S]*?\]);\r?\n\r?\nasync function seed/);

if (!catMatch || !prodMatch) {
  console.error('Could not parse categories or products from seed script');
  process.exit(1);
}

const CATEGORIES_DATA = eval(catMatch[1]);
const PRODUCTS_DATA = eval(prodMatch[1]);

function escapeSql(val) {
  if (val === null || val === undefined) return 'NULL';
  if (typeof val === 'number') return val;
  if (typeof val === 'boolean') return val ? 1 : 0;
  return `'${String(val).replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;
}

let sql = `-- =========================================================================\n`;
sql += `-- RAGHAV RASOI (raghavrasoi.com) - Full Production MySQL Database Dump\n`;
sql += `-- Generated on: ${new Date().toISOString()}\n`;
sql += `-- Database: MySQL 8.0+ / MariaDB 10.4+\n`;
sql += `-- =========================================================================\n\n`;

sql += `SET FOREIGN_KEY_CHECKS = 0;\n\n`;

// Append DDL
sql += ddl;
sql += `\n\n-- =========================================================================\n`;
sql += `-- DATA INSERTS\n`;
sql += `-- =========================================================================\n\n`;

// Store Setting
sql += `-- 1. Store Setting\n`;
sql += `INSERT INTO \`StoreSetting\` (\`id\`, \`name\`, \`address\`, \`isOpen\`, \`prepTimeMins\`, \`gstPercent\`, \`packagingCharge\`, \`allowPayAtShop\`, \`updatedAt\`) VALUES\n`;
sql += `(1, 'राघव रसोई (Raghav Rasoi) - नास्ता एवं थाली जंक्शन', 'Gunderdehi Town Rd, Gundardehi, Chainganj, Chhattisgarh 491223', 1, 15, 5.0, 10.0, 1, NOW())\n`;
sql += `ON DUPLICATE KEY UPDATE \`name\`=VALUES(\`name\`), \`address\`=VALUES(\`address\`);\n\n`;

// Staff Users
sql += `-- 2. Staff Accounts (Super Admin & Kitchen Staff)\n`;
sql += `INSERT INTO \`StaffUser\` (\`id\`, \`name\`, \`roleTitle\`, \`login\`, \`password\`, \`isOwner\`, \`permissions\`, \`createdAt\`) VALUES\n`;
sql += `('staff-owner', 'Raghav Rasoi Admin (Owner)', 'Store Owner', 'admin@raghavrasoi.com', 'admin123', 1, '["kanban","print_kot","toggle_stock","manage_menu","manage_categories","manage_coupons","view_dashboard","store_settings"]', NOW()),\n`;
sql += `('staff-rahul', 'Rahul (Kitchen Staff)', 'Kitchen Manager', 'rahul.kitchen@raghavrasoi.com', 'staff123', 0, '["kanban","print_kot","toggle_stock"]', NOW())\n`;
sql += `ON DUPLICATE KEY UPDATE \`name\`=VALUES(\`name\`), \`password\`=VALUES(\`password\`);\n\n`;

// Categories
sql += `-- 3. Categories (12 Authentic Categories)\n`;
sql += `INSERT INTO \`Category\` (\`id\`, \`name\`, \`slug\`, \`image\`, \`imageUrl\`, \`active\`, \`displayOrder\`, \`createdAt\`) VALUES\n`;
const catRows = CATEGORIES_DATA.map((c) => {
  return `(${escapeSql(c.id)}, ${escapeSql(c.name)}, ${escapeSql(c.slug)}, ${escapeSql(c.image)}, ${escapeSql(c.image)}, 1, ${c.displayOrder}, NOW())`;
});
sql += catRows.join(',\n') + '\n';
sql += `ON DUPLICATE KEY UPDATE \`name\`=VALUES(\`name\`), \`image\`=VALUES(\`image\`);\n\n`;

// Products
sql += `-- 4. Products (80 Authentic Dishes)\n`;
sql += `INSERT INTO \`Product\` (\`id\`, \`name\`, \`title\`, \`slug\`, \`categoryId\`, \`subCategory\`, \`veg\`, \`bestseller\`, \`isBestSeller\`, \`customizable\`, \`inStock\`, \`isSale\`, \`mrp\`, \`price\`, \`compareAtPrice\`, \`image\`, \`imageUrl\`, \`gallery\`, \`story\`, \`ingredients\`, \`calories\`, \`prepTime\`, \`desc\`, \`description\`, \`colors\`, \`createdAt\`) VALUES\n`;
const prodRows = PRODUCTS_DATA.map((p) => {
  return `(${escapeSql(p.id)}, ${escapeSql(p.name)}, ${escapeSql(p.name)}, ${escapeSql(p.slug)}, ${escapeSql(p.categoryId)}, ${escapeSql(p.subCategory)}, 1, ${p.bestseller ? 1 : 0}, ${p.bestseller ? 1 : 0}, 1, 1, ${p.isSale ? 1 : 0}, ${p.mrp || 199}, ${p.price}, ${p.mrp || 199}, ${escapeSql(p.image)}, ${escapeSql(p.image)}, NULL, NULL, ${escapeSql(p.ingredients)}, ${p.calories || 380}, ${escapeSql(p.prepTime || '15-20 mins')}, ${escapeSql(p.desc)}, ${escapeSql(p.desc)}, NULL, NOW())`;
});
sql += prodRows.join(',\n') + '\n';
sql += `ON DUPLICATE KEY UPDATE \`name\`=VALUES(\`name\`), \`price\`=VALUES(\`price\`), \`image\`=VALUES(\`image\`);\n\n`;

// Dining Tables
sql += `-- 5. Restaurant Dining Tables (12 Tables)\n`;
sql += `INSERT INTO \`RestaurantTable\` (\`id\`, \`tableNo\`, \`name\`, \`seats\`, \`status\`, \`activeOrder\`, \`displayOrder\`, \`createdAt\`, \`updatedAt\`) VALUES\n`;
const tableRows = [];
for (let i = 1; i <= 12; i++) {
  tableRows.push(`('tbl-${i}', 'Table-${i}', 'Table ${i}', ${i % 4 === 0 ? 6 : 4}, 'AVAILABLE', NULL, ${i}, NOW(), NOW())`);
}
sql += tableRows.join(',\n') + '\n';
sql += `ON DUPLICATE KEY UPDATE \`name\`=VALUES(\`name\`), \`seats\`=VALUES(\`seats\`);\n\n`;

// Coupons
sql += `-- 6. Coupons\n`;
sql += `INSERT INTO \`Coupon\` (\`id\`, \`code\`, \`type\`, \`value\`, \`minOrder\`, \`maxDiscount\`, \`desc\`, \`active\`, \`createdAt\`) VALUES\n`;
sql += `('cpn-welcome', 'WELCOME50', 'PERCENT', 20.0, 199, 100, 'Get 20% OFF up to ₹100 on your first order above ₹199!', 1, NOW()),\n`;
sql += `('cpn-raghav', 'RAGHAV10', 'FLAT', 50.0, 300, 50, 'Flat ₹50 OFF on orders above ₹300', 1, NOW())\n`;
sql += `ON DUPLICATE KEY UPDATE \`desc\`=VALUES(\`desc\`);\n\n`;

sql += `SET FOREIGN_KEY_CHECKS = 1;\n\n`;
sql += `-- =========================================================================\n`;
sql += `-- END OF RAGHAV RASOI DATABASE DUMP\n`;
sql += `-- =========================================================================\n`;

fs.writeFileSync('raghavrasoi_full_database.sql', sql, 'utf-8');
console.log(`✓ Full MySQL Dump written to raghavrasoi_full_database.sql (${(sql.length / 1024).toFixed(1)} KB)`);
