-- =========================================================================
-- RAGHAV RASOI (raghavrasoi.com) - Full Production MySQL Database Dump
-- Generated on: 2026-11-24T09:19:42.533Z
-- Database: MySQL 8.0+ / MariaDB 10.4+
-- =========================================================================

SET FOREIGN_KEY_CHECKS = 0;

-- CreateTable
CREATE TABLE `StaffUser` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `roleTitle` VARCHAR(191) NOT NULL,
    `login` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL DEFAULT 'staff@123',
    `isOwner` BOOLEAN NOT NULL DEFAULT false,
    `permissions` TEXT NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `StaffUser_login_key`(`login`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `StoreSetting` (
    `id` INTEGER NOT NULL DEFAULT 1,
    `name` VARCHAR(191) NOT NULL DEFAULT 'Raghav Rasoi',
    `address` TEXT NOT NULL DEFAULT 'Gunderdehi Town Rd, Gundardehi, Chainganj, Chhattisgarh 491223',
    `isOpen` BOOLEAN NOT NULL DEFAULT true,
    `prepTimeMins` INTEGER NOT NULL DEFAULT 15,
    `gstPercent` DOUBLE NOT NULL DEFAULT 5.0,
    `packagingCharge` DOUBLE NOT NULL DEFAULT 10.0,
    `allowPayAtShop` BOOLEAN NOT NULL DEFAULT true,
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Category` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NULL,
    `image` VARCHAR(191) NOT NULL,
    `imageUrl` VARCHAR(191) NULL,
    `active` BOOLEAN NOT NULL DEFAULT true,
    `displayOrder` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Category_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Product` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NULL,
    `slug` VARCHAR(191) NULL,
    `categoryId` VARCHAR(191) NOT NULL,
    `subCategory` VARCHAR(191) NULL,
    `veg` BOOLEAN NOT NULL DEFAULT true,
    `bestseller` BOOLEAN NOT NULL DEFAULT false,
    `isBestSeller` BOOLEAN NOT NULL DEFAULT false,
    `customizable` BOOLEAN NOT NULL DEFAULT true,
    `inStock` BOOLEAN NOT NULL DEFAULT true,
    `isSale` BOOLEAN NOT NULL DEFAULT false,
    `mrp` DOUBLE NOT NULL DEFAULT 199,
    `price` DOUBLE NOT NULL,
    `compareAtPrice` DOUBLE NULL,
    `image` VARCHAR(191) NOT NULL,
    `imageUrl` VARCHAR(191) NULL,
    `gallery` TEXT NULL,
    `story` TEXT NULL,
    `ingredients` TEXT NULL,
    `calories` INTEGER NULL DEFAULT 380,
    `prepTime` VARCHAR(191) NULL DEFAULT '15-20 mins',
    `desc` TEXT NOT NULL DEFAULT '',
    `description` TEXT NULL,
    `colors` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Product_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Coupon` (
    `id` VARCHAR(191) NOT NULL,
    `code` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL DEFAULT 'PERCENT',
    `value` DOUBLE NOT NULL,
    `minOrder` DOUBLE NOT NULL DEFAULT 0,
    `maxDiscount` DOUBLE NULL,
    `desc` TEXT NOT NULL,
    `active` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Coupon_code_key`(`code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CustomerUser` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `otpCode` VARCHAR(191) NULL,
    `otpExpiresAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `CustomerUser_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Order` (
    `id` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'PENDING',
    `customerId` VARCHAR(191) NULL,
    `customerName` VARCHAR(191) NOT NULL,
    `customerPhone` VARCHAR(191) NOT NULL,
    `customerEmail` VARCHAR(191) NULL,
    `isGuest` BOOLEAN NOT NULL DEFAULT true,
    `orderType` VARCHAR(191) NOT NULL DEFAULT 'IN_TABLE',
    `tableNo` VARCHAR(191) NULL,
    `deliveryAddress` TEXT NULL,
    `paymentMethod` VARCHAR(191) NOT NULL DEFAULT 'CASH_IN_COUNTER',
    `pickupTime` VARCHAR(191) NOT NULL DEFAULT 'Pick Up Now (15m)',
    `paymentStatus` VARCHAR(191) NOT NULL DEFAULT 'PENDING',
    `couponCode` VARCHAR(191) NULL,
    `discountAmount` DOUBLE NOT NULL DEFAULT 0,
    `itemTotal` DOUBLE NOT NULL,
    `gstAmount` DOUBLE NOT NULL DEFAULT 0,
    `packagingCharge` DOUBLE NOT NULL DEFAULT 10,
    `grandTotal` DOUBLE NOT NULL,
    `currency` VARCHAR(191) NOT NULL DEFAULT 'INR',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `OrderItem` (
    `id` VARCHAR(191) NOT NULL,
    `orderId` VARCHAR(191) NOT NULL,
    `productId` VARCHAR(191) NULL,
    `name` VARCHAR(191) NOT NULL,
    `qty` INTEGER NOT NULL DEFAULT 1,
    `size` VARCHAR(191) NOT NULL DEFAULT 'Regular',
    `addons` TEXT NULL,
    `note` TEXT NULL,
    `unitPrice` DOUBLE NOT NULL,
    `lineTotal` DOUBLE NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Deal` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `subtitle` VARCHAR(191) NULL,
    `targetDate` DATETIME(3) NULL,
    `buttonText` VARCHAR(191) NOT NULL DEFAULT 'ORDER NOW',
    `imageUrl` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `NewsletterSubscriber` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NOT NULL,
    `subscribedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `NewsletterSubscriber_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RestaurantTable` (
    `id` VARCHAR(191) NOT NULL,
    `tableNo` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `seats` INTEGER NOT NULL DEFAULT 4,
    `status` VARCHAR(191) NOT NULL DEFAULT 'AVAILABLE',
    `activeOrder` VARCHAR(191) NULL,
    `displayOrder` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `RestaurantTable_tableNo_key`(`tableNo`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Product` ADD CONSTRAINT `Product_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `Category`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Order` ADD CONSTRAINT `Order_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `CustomerUser`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OrderItem` ADD CONSTRAINT `OrderItem_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `Order`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OrderItem` ADD CONSTRAINT `OrderItem_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;



-- =========================================================================
-- DATA INSERTS
-- =========================================================================

-- 1. Store Setting
INSERT INTO `StoreSetting` (`id`, `name`, `address`, `isOpen`, `prepTimeMins`, `gstPercent`, `packagingCharge`, `allowPayAtShop`, `updatedAt`) VALUES
(1, 'राघव रसोई (Raghav Rasoi) - नास्ता एवं थाली जंक्शन', 'Gunderdehi Town Rd, Gundardehi, Chainganj, Chhattisgarh 491223', 1, 15, 5.0, 10.0, 1, NOW())
ON DUPLICATE KEY UPDATE `name`=VALUES(`name`), `address`=VALUES(`address`);

-- 2. Staff Accounts (Super Admin & Kitchen Staff)
INSERT INTO `StaffUser` (`id`, `name`, `roleTitle`, `login`, `password`, `isOwner`, `permissions`, `createdAt`) VALUES
('staff-owner', 'Raghav Rasoi Admin (Owner)', 'Store Owner', 'admin@raghavrasoi.com', 'admin123', 1, '["kanban","print_kot","toggle_stock","manage_menu","manage_categories","manage_coupons","view_dashboard","store_settings"]', NOW()),
('staff-rahul', 'Rahul (Kitchen Staff)', 'Kitchen Manager', 'rahul.kitchen@raghavrasoi.com', 'staff123', 0, '["kanban","print_kot","toggle_stock"]', NOW())
ON DUPLICATE KEY UPDATE `name`=VALUES(`name`), `password`=VALUES(`password`);

-- 3. Categories (12 Authentic Categories)
INSERT INTO `Category` (`id`, `name`, `slug`, `image`, `imageUrl`, `active`, `displayOrder`, `createdAt`) VALUES
('cat-breakfast-maggi', 'Breakfast & Maggi Special', 'breakfast-maggi', 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=800&q=80', 1, 1, NOW()),
('cat-south-indian', 'South Indian', 'south-indian', 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80', 1, 2, NOW()),
('cat-chinese-starters', 'Chinese & Starters', 'chinese-starters', 'https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?auto=format&fit=crop&w=800&q=80', 1, 3, NOW()),
('cat-chinese-rice', 'Chinese Rice', 'chinese-rice', 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=800&q=80', 1, 4, NOW()),
('cat-roti-paratha', 'Roti & Paratha', 'roti-paratha', 'https://images.unsplash.com/photo-1626074353765-517a681e40be?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1626074353765-517a681e40be?auto=format&fit=crop&w=800&q=80', 1, 5, NOW()),
('cat-thali-special', 'Thali Special', 'thali-special', 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?auto=format&fit=crop&w=800&q=80', 1, 6, NOW()),
('cat-dal-rice', 'Dal & Rice', 'dal-rice', 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80', 1, 7, NOW()),
('cat-sabji-special', 'Sabji Special', 'sabji-special', 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=800&q=80', 1, 8, NOW()),
('cat-paneer-special', 'Paneer Special', 'paneer-special', 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=800&q=80', 1, 9, NOW()),
('cat-salad-papad-raita', 'Salad, Papad & Raita', 'salad-papad-raita', 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80', 1, 10, NOW()),
('cat-tea-coffee', 'Tea & Coffee', 'tea-coffee', 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80', 1, 11, NOW()),
('cat-beverages-desserts', 'Beverages & Desserts', 'beverages-desserts', 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80', 1, 12, NOW())
ON DUPLICATE KEY UPDATE `name`=VALUES(`name`), `image`=VALUES(`image`);

-- 4. Products (80 Authentic Dishes)
INSERT INTO `Product` (`id`, `name`, `title`, `slug`, `categoryId`, `subCategory`, `veg`, `bestseller`, `isBestSeller`, `customizable`, `inStock`, `isSale`, `mrp`, `price`, `compareAtPrice`, `image`, `imageUrl`, `gallery`, `story`, `ingredients`, `calories`, `prepTime`, `desc`, `description`, `colors`, `createdAt`) VALUES
('prod-poori-sabji', 'Poori Sabji Special', 'Poori Sabji Special', 'poori-sabji-special', 'cat-breakfast-maggi', 'Breakfast', 1, 1, 1, 1, 1, 1, 40, 30, 40, 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=800&q=80', NULL, NULL, 'Whole wheat flour, potatoes, cumin, fenugreek, green chillies, ginger', 390, '10-15 mins', '4 golden fluffy pooris served with spiced aloo sabji and traditional tangy mango pickle. (Full Plate)', '4 golden fluffy pooris served with spiced aloo sabji and traditional tangy mango pickle. (Full Plate)', NULL, NOW()),
('prod-chole-bhature', 'Amritsari Chole Bhature', 'Amritsari Chole Bhature', 'amritsari-chole-bhature', 'cat-breakfast-maggi', 'Breakfast', 1, 1, 1, 1, 1, 1, 90, 70, 90, 'https://images.unsplash.com/photo-1626132647523-66f5bf380027?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1626132647523-66f5bf380027?auto=format&fit=crop&w=800&q=80', NULL, NULL, 'Kabuli chana, flour, pomegranate seeds, whole garam masala, green chillies', 520, '12-15 mins', '2 large puffy bhaturas served with authentic Amritsari dark spicy chole, sliced onions, and pickle.', '2 large puffy bhaturas served with authentic Amritsari dark spicy chole, sliced onions, and pickle.', NULL, NOW()),
('prod-masala-maggi', 'Classic Masala Maggi', 'Classic Masala Maggi', 'classic-masala-maggi', 'cat-breakfast-maggi', 'Maggi Special', 1, 0, 0, 1, 1, 1, 60, 50, 60, 'https://images.unsplash.com/photo-1612927601601-6638404737ce?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1612927601601-6638404737ce?auto=format&fit=crop&w=800&q=80', NULL, NULL, 'Noodles, proprietary spice blend, cilantro, butter', 310, '8-10 mins', 'All-time favorite noodles tossed with special house spice mix and fresh herbs.', 'All-time favorite noodles tossed with special house spice mix and fresh herbs.', NULL, NOW()),
('prod-veg-maggi', 'Desi Vegetable Maggi', 'Desi Vegetable Maggi', 'desi-vegetable-maggi', 'cat-breakfast-maggi', 'Maggi Special', 1, 0, 0, 1, 1, 1, 85, 70, 85, 'https://images.unsplash.com/photo-1612927601601-6638404737ce?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1612927601601-6638404737ce?auto=format&fit=crop&w=800&q=80', NULL, NULL, 'Noodles, green peas, capsicum, carrots, onions, tomatoes, spices', 340, '10-12 mins', 'Hot noodles loaded with crunchy carrots, green peas, capsicum, sweet onions, and aromatic masala.', 'Hot noodles loaded with crunchy carrots, green peas, capsicum, sweet onions, and aromatic masala.', NULL, NOW()),
('prod-sweet-corn-maggi', 'Sweet Corn Butter Maggi', 'Sweet Corn Butter Maggi', 'sweet-corn-butter-maggi', 'cat-breakfast-maggi', 'Maggi Special', 1, 0, 0, 1, 1, 1, 120, 100, 120, 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=800&q=80', NULL, NULL, 'Sweet corn, amul butter, masala noodles, fresh herbs', 380, '10-12 mins', 'Sweet golden corn kernels sautéed in butter tossed with piping-hot masala noodles.', 'Sweet golden corn kernels sautéed in butter tossed with piping-hot masala noodles.', NULL, NOW()),
('prod-idli-sambar', 'Steamed Idli Sambar (2 Pcs)', 'Steamed Idli Sambar (2 Pcs)', 'steamed-idli-sambar', 'cat-south-indian', 'Idli & Vada', 1, 1, 1, 1, 1, 1, 40, 30, 40, 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80', NULL, NULL, 'Rice, urad dal, toor dal, drumsticks, mustard seeds, curry leaves', 180, '10 mins', 'Soft and spongy steamed rice-lentil cakes served with steaming hot vegetable sambar and coconut chutney.', 'Soft and spongy steamed rice-lentil cakes served with steaming hot vegetable sambar and coconut chutney.', NULL, NOW()),
('prod-sambar-vada', 'Crispy Medu Vada Sambar (2 Pcs)', 'Crispy Medu Vada Sambar (2 Pcs)', 'crispy-medu-vada-sambar', 'cat-south-indian', 'Idli & Vada', 1, 0, 0, 1, 1, 1, 50, 40, 50, 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=800&q=80', NULL, NULL, 'Urad dal, peppercorns, curry leaves, hing, sambar', 260, '10-12 mins', '2 crispy, golden-fried lentil donuts soaked in spicy aromatic sambar with coconut chutney.', '2 crispy, golden-fried lentil donuts soaked in spicy aromatic sambar with coconut chutney.', NULL, NOW()),
('prod-plain-dosa', 'Crispy Plain Dosa', 'Crispy Plain Dosa', 'crispy-plain-dosa', 'cat-south-indian', 'Dosas', 1, 0, 0, 1, 1, 1, 50, 40, 50, 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=800&q=80', NULL, NULL, 'Rice, urad dal batter, fenugreek, oil', 220, '12 mins', 'Thin, crisp fermented rice crepe roasted golden on tawa, served with sambar and fresh chutney.', 'Thin, crisp fermented rice crepe roasted golden on tawa, served with sambar and fresh chutney.', NULL, NOW()),
('prod-masala-dosa', 'Classic Masala Dosa', 'Classic Masala Dosa', 'classic-masala-dosa', 'cat-south-indian', 'Dosas', 1, 1, 1, 1, 1, 1, 70, 50, 70, 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80', NULL, NULL, 'Fermented batter, spiced potatoes, onions, curry leaves, mustard seeds', 320, '12-15 mins', 'Crispy golden crepe stuffed with traditional spiced mustard and curry-leaf potato mash.', 'Crispy golden crepe stuffed with traditional spiced mustard and curry-leaf potato mash.', NULL, NOW()),
('prod-masala-dosa-cut', 'Masala Dosa Cut-Piece', 'Masala Dosa Cut-Piece', 'masala-dosa-cut-piece', 'cat-south-indian', 'Dosas', 1, 0, 0, 1, 1, 1, 75, 60, 75, 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=800&q=80', NULL, NULL, 'Dosa batter, potato masala, butter, chutney', 330, '12 mins', 'Crisp stuffed masala dosa sliced into bite-sized finger rolls for effortless snacking.', 'Crisp stuffed masala dosa sliced into bite-sized finger rolls for effortless snacking.', NULL, NOW()),
('prod-masala-press-dosa', 'Butter Pressed Masala Dosa', 'Butter Pressed Masala Dosa', 'butter-pressed-masala-dosa', 'cat-south-indian', 'Dosas', 1, 0, 0, 1, 1, 1, 80, 60, 80, 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80', NULL, NULL, 'Dosa batter, butter, potato masala, podi chutney', 370, '12 mins', 'Tawa-pressed extra crisp dosa roasted in pure butter packed with spiced potato filling.', 'Tawa-pressed extra crisp dosa roasted in pure butter packed with spiced potato filling.', NULL, NOW()),
('prod-cheese-corn-dosa', 'Cheese Sweet Corn Dosa', 'Cheese Sweet Corn Dosa', 'cheese-sweet-corn-dosa', 'cat-south-indian', 'Dosas', 1, 0, 0, 1, 1, 1, 130, 110, 130, 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=800&q=80', NULL, NULL, 'Dosa batter, mozzarella cheese, sweet corn, butter, herbs', 420, '15 mins', 'Golden crisp dosa loaded with melted mozzarella cheese and juicy sweet corn niblets.', 'Golden crisp dosa loaded with melted mozzarella cheese and juicy sweet corn niblets.', NULL, NOW()),
('prod-paneer-dosa', 'Special Paneer Masala Dosa', 'Special Paneer Masala Dosa', 'special-paneer-masala-dosa', 'cat-south-indian', 'Dosas', 1, 1, 1, 1, 1, 1, 145, 120, 145, 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80', NULL, NULL, 'Dosa batter, fresh paneer, onion, green chillies, coriander', 430, '15 mins', 'Crispy crepe generously filled with freshly seasoned grated cottage cheese (paneer).', 'Crispy crepe generously filled with freshly seasoned grated cottage cheese (paneer).', NULL, NOW()),
('prod-veg-uttapam', 'Vegetable Uttapam', 'Vegetable Uttapam', 'vegetable-uttapam', 'cat-south-indian', 'Uttapam', 1, 0, 0, 1, 1, 1, 85, 70, 85, 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=800&q=80', NULL, NULL, 'Fermented batter, onions, tomatoes, green chillies, coriander', 280, '15 mins', 'Thick savory rice pancake topped with fresh onions, ripe tomatoes, and green chillies.', 'Thick savory rice pancake topped with fresh onions, ripe tomatoes, and green chillies.', NULL, NOW()),
('prod-veg-steamed-momos', 'Veg Steamed Momos', 'Veg Steamed Momos', 'veg-steamed-momos', 'cat-chinese-starters', 'Momos', 1, 1, 1, 1, 1, 1, 80, 60, 80, 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=800&q=80', NULL, NULL, 'Flour, cabbage, carrots, ginger, garlic, spicy red chilli dip', 210, '12-15 mins', 'Steamed dumplings stuffed with minced cabbage, carrots, ginger, and garlic. (Full: ₹60 / Half: ₹30)', 'Steamed dumplings stuffed with minced cabbage, carrots, ginger, and garlic. (Full: ₹60 / Half: ₹30)', NULL, NOW()),
('prod-veg-fried-momos', 'Veg Crispy Fried Momos', 'Veg Crispy Fried Momos', 'veg-crispy-fried-momos', 'cat-chinese-starters', 'Momos', 1, 1, 1, 1, 1, 1, 90, 70, 90, 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=800&q=80', NULL, NULL, 'Dumpling wrapper, seasoned vegetable mix, hot garlic sauce', 310, '12-15 mins', 'Golden deep-fried dumplings with a crunchy outer shell and spicy dip. (Full: ₹70 / Half: ₹40)', 'Golden deep-fried dumplings with a crunchy outer shell and spicy dip. (Full: ₹70 / Half: ₹40)', NULL, NOW()),
('prod-chana-roast', 'Crispy Chana Roast', 'Crispy Chana Roast', 'crispy-chana-roast', 'cat-chinese-starters', 'Starters', 1, 0, 0, 1, 1, 1, 140, 120, 140, 'https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?auto=format&fit=crop&w=800&q=80', NULL, NULL, 'Chickpeas, chaat masala, lemon, onions, green chillies', 240, '10 mins', 'Spiced roasted chickpeas tossed with tangy chaat masala, lemon juice, green chillies, and onions.', 'Spiced roasted chickpeas tossed with tangy chaat masala, lemon juice, green chillies, and onions.', NULL, NOW()),
('prod-finger-chips', 'Crispy Finger Chips', 'Crispy Finger Chips', 'crispy-finger-chips', 'cat-chinese-starters', 'Starters', 1, 0, 0, 1, 1, 1, 140, 120, 140, 'https://images.unsplash.com/photo-1576107232684-1279f3908594?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1576107232684-1279f3908594?auto=format&fit=crop&w=800&q=80', NULL, NULL, 'Potatoes, vegetable oil, sea salt', 290, '10 mins', 'Golden salted French fries served hot with tomato ketchup and mint dip.', 'Golden salted French fries served hot with tomato ketchup and mint dip.', NULL, NOW()),
('prod-paneer-pakoda', 'Crispy Paneer Pakoda (8 Pcs)', 'Crispy Paneer Pakoda (8 Pcs)', 'crispy-paneer-pakoda', 'cat-chinese-starters', 'Starters', 1, 1, 1, 1, 1, 1, 180, 150, 180, 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80', NULL, NULL, 'Fresh paneer, besan, ajwain, red chilli, chaat masala', 390, '12-15 mins', 'Fresh paneer fingers dipped in seasoned spiced gram flour (besan) and fried till golden.', 'Fresh paneer fingers dipped in seasoned spiced gram flour (besan) and fried till golden.', NULL, NOW()),
('prod-veg-chowmein', 'Street-Style Veg Chowmein', 'Street-Style Veg Chowmein', 'street-style-veg-chowmein', 'cat-chinese-starters', 'Noodles', 1, 0, 0, 1, 1, 1, 150, 130, 150, 'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=800&q=80', NULL, NULL, 'Noodles, cabbage, carrots, capsicum, soya sauce, vinegar, chilli oil', 360, '12 mins', 'Wok-tossed noodles with shredded cabbage, capsicum, spring onions, and dark soya glaze.', 'Wok-tossed noodles with shredded cabbage, capsicum, spring onions, and dark soya glaze.', NULL, NOW()),
('prod-veg-hakka-noodles', 'Classic Veg Hakka Noodles', 'Classic Veg Hakka Noodles', 'classic-veg-hakka-noodles', 'cat-chinese-starters', 'Noodles', 1, 1, 1, 1, 1, 1, 160, 140, 160, 'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=800&q=80', NULL, NULL, 'Hakka noodles, bell peppers, scallions, garlic, white pepper', 350, '12 mins', 'Fresh non-sticky noodles stir-fried with julienned vegetables and mild seasonings.', 'Fresh non-sticky noodles stir-fried with julienned vegetables and mild seasonings.', NULL, NOW()),
('prod-paneer-chilli', 'Chilli Paneer (Dry / Gravy)', 'Chilli Paneer (Dry / Gravy)', 'chilli-paneer-dry-gravy', 'cat-chinese-starters', 'Starters', 1, 1, 1, 1, 1, 1, 220, 190, 220, 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=800&q=80', NULL, NULL, 'Paneer, capsicum, onions, green chillies, garlic, soya sauce', 420, '15 mins', 'Fried paneer cubes tossed with capsicum, onion, and oriental spicy garlic chilli sauce.', 'Fried paneer cubes tossed with capsicum, onion, and oriental spicy garlic chilli sauce.', NULL, NOW()),
('prod-paneer-65', 'Spicy Paneer 65', 'Spicy Paneer 65', 'spicy-paneer-65', 'cat-chinese-starters', 'Starters', 1, 0, 0, 1, 1, 1, 220, 190, 220, 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=800&q=80', NULL, NULL, 'Paneer, yogurt, red chilli powder, curry leaves, ginger-garlic', 410, '15 mins', 'Crispy paneer chunks marinated in southern spices, curry leaves, and yogurt.', 'Crispy paneer chunks marinated in southern spices, curry leaves, and yogurt.', NULL, NOW()),
('prod-lovely-corn', 'Crispy Lovely Corn Special', 'Crispy Lovely Corn Special', 'crispy-lovely-corn-special', 'cat-chinese-starters', 'Starters', 1, 0, 0, 1, 1, 1, 210, 180, 210, 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=800&q=80', NULL, NULL, 'Sweet corn, cornflour, scallions, garlic, black pepper', 320, '12 mins', 'Golden battered sweet corn tossed with spring onions, garlic, and special aromatics.', 'Golden battered sweet corn tossed with spring onions, garlic, and special aromatics.', NULL, NOW()),
('prod-crispy-corn', 'Chatpata Crispy Corn', 'Chatpata Crispy Corn', 'chatpata-crispy-corn', 'cat-chinese-starters', 'Starters', 1, 0, 0, 1, 1, 1, 210, 180, 210, 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=800&q=80', NULL, NULL, 'Corn, chaat masala, lemon juice, green chillies', 310, '12 mins', 'Crunchy corn kernels tossed with roasted cumin, lime, and black pepper.', 'Crunchy corn kernels tossed with roasted cumin, lime, and black pepper.', NULL, NOW()),
('prod-soya-chilli', 'Chilli Soya Chunks', 'Chilli Soya Chunks', 'chilli-soya-chunks', 'cat-chinese-starters', 'Starters', 1, 0, 0, 1, 1, 1, 200, 170, 200, 'https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?auto=format&fit=crop&w=800&q=80', NULL, NULL, 'Soya chunks, capsicum, onions, green chillies, garlic, soya sauce', 290, '15 mins', 'High-protein soya nuggets tossed with green chillies, onions, and soya sauce.', 'High-protein soya nuggets tossed with green chillies, onions, and soya sauce.', NULL, NOW()),
('prod-veg-manchurian', 'Veg Manchurian (Dry / Gravy)', 'Veg Manchurian (Dry / Gravy)', 'veg-manchurian-dry-gravy', 'cat-chinese-starters', 'Starters', 1, 1, 1, 1, 1, 1, 180, 150, 180, 'https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?auto=format&fit=crop&w=800&q=80', NULL, NULL, 'Cabbage, carrots, garlic, ginger, cornstarch, soya sauce', 340, '15 mins', 'Savory vegetable dumplings in a glossy garlic, ginger, and dark soya sauce.', 'Savory vegetable dumplings in a glossy garlic, ginger, and dark soya sauce.', NULL, NOW()),
('prod-veg-fried-rice', 'Classic Veg Fried Rice', 'Classic Veg Fried Rice', 'classic-veg-fried-rice', 'cat-chinese-rice', 'Fried Rice', 1, 0, 0, 1, 1, 1, 150, 130, 150, 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=800&q=80', NULL, NULL, 'Basmati rice, carrots, beans, scallions, white pepper, sesame oil', 360, '12 mins', 'Basmati rice stir-fried with diced carrots, beans, and spring onions.', 'Basmati rice stir-fried with diced carrots, beans, and spring onions.', NULL, NOW()),
('prod-schezwan-rice', 'Spicy Schezwan Fried Rice', 'Spicy Schezwan Fried Rice', 'spicy-schezwan-fried-rice', 'cat-chinese-rice', 'Fried Rice', 1, 0, 0, 1, 1, 1, 165, 140, 165, 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=800&q=80', NULL, NULL, 'Rice, schezwan sauce, dry red chillies, garlic, vegetables', 380, '12 mins', 'Wok-tossed rice flavored with bold garlic Schezwan chili paste and vegetables.', 'Wok-tossed rice flavored with bold garlic Schezwan chili paste and vegetables.', NULL, NOW()),
('prod-paneer-fried-rice', 'Paneer Veg Fried Rice', 'Paneer Veg Fried Rice', 'paneer-veg-fried-rice', 'cat-chinese-rice', 'Fried Rice', 1, 1, 1, 1, 1, 1, 190, 160, 190, 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=800&q=80', NULL, NULL, 'Basmati rice, fresh paneer cubes, vegetables, soya sauce, white pepper', 430, '15 mins', 'Fried rice tossed with golden paneer cubes and crunchy vegetables.', 'Fried rice tossed with golden paneer cubes and crunchy vegetables.', NULL, NOW()),
('prod-tawa-roti', 'Tawa Plain Roti', 'Tawa Plain Roti', 'tawa-plain-roti', 'cat-roti-paratha', 'Breads', 1, 0, 0, 1, 1, 0, 12, 10, 12, 'https://images.unsplash.com/photo-1626074353765-517a681e40be?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1626074353765-517a681e40be?auto=format&fit=crop&w=800&q=80', NULL, NULL, '100% whole wheat flour, water', 85, '5 mins', 'Soft whole wheat flatbread made fresh on tawa.', 'Soft whole wheat flatbread made fresh on tawa.', NULL, NOW()),
('prod-tawa-butter-roti', 'Tawa Butter Roti', 'Tawa Butter Roti', 'tawa-butter-roti', 'cat-roti-paratha', 'Breads', 1, 1, 1, 1, 1, 0, 18, 15, 18, 'https://images.unsplash.com/photo-1626074353765-517a681e40be?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1626074353765-517a681e40be?auto=format&fit=crop&w=800&q=80', NULL, NULL, 'Whole wheat flour, butter', 120, '5 mins', 'Fresh whole wheat tawa roti topped with melting butter.', 'Fresh whole wheat tawa roti topped with melting butter.', NULL, NOW()),
('prod-plain-paratha', 'Layered Plain Paratha', 'Layered Plain Paratha', 'layered-plain-paratha', 'cat-roti-paratha', 'Paratha', 1, 0, 0, 1, 1, 0, 25, 20, 25, 'https://images.unsplash.com/photo-1626074353765-517a681e40be?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1626074353765-517a681e40be?auto=format&fit=crop&w=800&q=80', NULL, NULL, 'Wheat flour, ghee, salt', 180, '8 mins', 'Flaky tawa-roasted layered wheat paratha.', 'Flaky tawa-roasted layered wheat paratha.', NULL, NOW()),
('prod-aloo-paratha', 'Stuffed Aloo Paratha', 'Stuffed Aloo Paratha', 'stuffed-aloo-paratha', 'cat-roti-paratha', 'Paratha', 1, 1, 1, 1, 1, 1, 65, 50, 65, 'https://images.unsplash.com/photo-1626074353765-517a681e40be?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1626074353765-517a681e40be?auto=format&fit=crop&w=800&q=80', NULL, NULL, 'Wheat flour, mashed potatoes, green chillies, coriander, garam masala, butter', 290, '10 mins', 'Wheat flatbread stuffed with spiced potatoes. (Add Fresh Curd for +₹20).', 'Wheat flatbread stuffed with spiced potatoes. (Add Fresh Curd for +₹20).', NULL, NOW()),
('prod-paneer-paratha', 'Stuffed Paneer Paratha', 'Stuffed Paneer Paratha', 'stuffed-paneer-paratha', 'cat-roti-paratha', 'Paratha', 1, 1, 1, 1, 1, 1, 110, 90, 110, 'https://images.unsplash.com/photo-1626074353765-517a681e40be?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1626074353765-517a681e40be?auto=format&fit=crop&w=800&q=80', NULL, NULL, 'Wheat flour, crumbled paneer, spices, fresh butter', 360, '10 mins', 'Rich paratha filled with grated seasoned paneer. (Add Fresh Curd for +₹20).', 'Rich paratha filled with grated seasoned paneer. (Add Fresh Curd for +₹20).', NULL, NOW()),
('prod-veg-thali', 'Raghav Special Veg Thali', 'Raghav Special Veg Thali', 'raghav-special-veg-thali', 'cat-thali-special', 'Thali', 1, 1, 1, 1, 1, 1, 90, 70, 90, 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?auto=format&fit=crop&w=800&q=80', NULL, NULL, '2 rotis, seasonal sabji, dal, basmati rice, pickle, salad', 550, '12 mins', 'Wholesome daily meal: 2 Tawa Rotis, 2 Sabjis, Dal, Steamed Rice, Pickle, Salad.', 'Wholesome daily meal: 2 Tawa Rotis, 2 Sabjis, Dal, Steamed Rice, Pickle, Salad.', NULL, NOW()),
('prod-veg-thali-special', 'Grand Veg Feast Thali', 'Grand Veg Feast Thali', 'grand-veg-feast-thali', 'cat-thali-special', 'Thali', 1, 1, 1, 1, 1, 1, 130, 100, 130, 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?auto=format&fit=crop&w=800&q=80', NULL, NULL, '3 rotis, 2 sabjis, dal, rice, papad, gulab jamun, boondi raita, salad, pickle', 720, '15 mins', 'Full feast meal: 3 Tawa Rotis, 2 Sabjis, Dal, Rice, Pickle, Salad, Papad, Gulab Jamun, Raita.', 'Full feast meal: 3 Tawa Rotis, 2 Sabjis, Dal, Rice, Pickle, Salad, Papad, Gulab Jamun, Raita.', NULL, NOW()),
('prod-paneer-thali-special', 'Royal Paneer Special Thali', 'Royal Paneer Special Thali', 'royal-paneer-special-thali', 'cat-thali-special', 'Thali', 1, 1, 1, 1, 1, 1, 180, 140, 180, 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?auto=format&fit=crop&w=800&q=80', NULL, NULL, '3 butter rotis, shahi paneer, seasonal sabji, dal fry, basmati rice, papad, raita, gulab jamun', 860, '15 mins', 'Chef royal feast: 3 Tawa Rotis, 3 Sabjis (including Shahi Paneer), Dal, Rice, Pickle, Salad, Papad, Raita, Gulab Jamun.', 'Chef royal feast: 3 Tawa Rotis, 3 Sabjis (including Shahi Paneer), Dal, Rice, Pickle, Salad, Papad, Raita, Gulab Jamun.', NULL, NOW()),
('prod-kadhi-chawal', 'Desi Kadhi Chawal Combo', 'Desi Kadhi Chawal Combo', 'desi-kadhi-chawal-combo', 'cat-thali-special', 'Combos', 1, 0, 0, 1, 1, 1, 80, 60, 80, 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80', NULL, NULL, 'Yogurt, besan pakodas, steamed rice, mustard seeds, fenugreek', 440, '10 mins', 'Traditional Punjabi besan pakoda kadhi served with hot steamed basmati rice.', 'Traditional Punjabi besan pakoda kadhi served with hot steamed basmati rice.', NULL, NOW()),
('prod-veg-pulao', 'Aromatic Veg Pulao', 'Aromatic Veg Pulao', 'aromatic-veg-pulao', 'cat-thali-special', 'Rice', 1, 0, 0, 1, 1, 1, 190, 160, 190, 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=800&q=80', NULL, NULL, 'Basmati rice, green peas, carrots, ghee, whole garam masala', 390, '15 mins', 'Fragrant basmati rice cooked with whole spices, green peas, and carrots.', 'Fragrant basmati rice cooked with whole spices, green peas, and carrots.', NULL, NOW()),
('prod-veg-biryani', 'Hyderabadi Veg Dum Biryani', 'Hyderabadi Veg Dum Biryani', 'hyderabadi-veg-dum-biryani', 'cat-thali-special', 'Biryani', 1, 1, 1, 1, 1, 1, 190, 160, 190, 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80', NULL, NULL, 'Long grain rice, vegetables, saffron, fried onions, mint, biryani spices', 460, '18 mins', 'Layered basmati rice slow-cooked with spiced vegetables, mint, and saffron.', 'Layered basmati rice slow-cooked with spiced vegetables, mint, and saffron.', NULL, NOW()),
('prod-steam-rice', 'Steamed Basmati Rice', 'Steamed Basmati Rice', 'steamed-basmati-rice', 'cat-dal-rice', 'Rice', 1, 0, 0, 1, 1, 1, 90, 70, 90, 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80', NULL, NULL, 'Aged basmati rice, water', 220, '10 mins', 'Fragrant long-grain steamed white basmati rice. (Full: ₹70 / Half: ₹40)', 'Fragrant long-grain steamed white basmati rice. (Full: ₹70 / Half: ₹40)', NULL, NOW()),
('prod-jeera-rice', 'Jeera Rice (Cumin Tempered)', 'Jeera Rice (Cumin Tempered)', 'jeera-rice-cumin-tempered', 'cat-dal-rice', 'Rice', 1, 1, 1, 1, 1, 1, 110, 90, 110, 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80', NULL, NULL, 'Basmati rice, cumin seeds, desi ghee, coriander', 260, '10 mins', 'Basmati rice tempered with roasted cumin seeds in desi ghee. (Full: ₹90 / Half: ₹60)', 'Basmati rice tempered with roasted cumin seeds in desi ghee. (Full: ₹90 / Half: ₹60)', NULL, NOW()),
('prod-plain-dal', 'Home-Style Plain Dal', 'Home-Style Plain Dal', 'home-style-plain-dal', 'cat-dal-rice', 'Dal', 1, 0, 0, 1, 1, 1, 80, 60, 80, 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80', NULL, NULL, 'Arhar/Moong dal, cumin, turmeric, salt', 190, '10 mins', 'Light and comforting yellow lentils tempered with cumin and turmeric.', 'Light and comforting yellow lentils tempered with cumin and turmeric.', NULL, NOW()),
('prod-dal-fry', 'Desi Dal Fry', 'Desi Dal Fry', 'desi-dal-fry', 'cat-dal-rice', 'Dal', 1, 0, 0, 1, 1, 1, 120, 100, 120, 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80', NULL, NULL, 'Toor dal, tomatoes, onions, ginger, garlic, garam masala', 240, '12 mins', 'Yellow lentils cooked with sauteed tomatoes, onions, ginger, and garlic.', 'Yellow lentils cooked with sauteed tomatoes, onions, ginger, and garlic.', NULL, NOW()),
('prod-dal-tadka', 'Dhabha Dal Tadka', 'Dhabha Dal Tadka', 'dhabha-dal-tadka', 'cat-dal-rice', 'Dal', 1, 1, 1, 1, 1, 1, 150, 120, 150, 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80', NULL, NULL, 'Yellow dal, desi ghee, dry red chillies, garlic, hing, jeera', 280, '12 mins', 'Sizzling desi ghee double tadka with whole red chillies and garlic.', 'Sizzling desi ghee double tadka with whole red chillies and garlic.', NULL, NOW()),
('prod-mix-veg', 'Desi Mix Vegetable', 'Desi Mix Vegetable', 'desi-mix-vegetable', 'cat-sabji-special', 'Sabji', 1, 1, 1, 1, 1, 1, 180, 150, 180, 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=800&q=80', NULL, NULL, 'Cauliflower, green peas, carrots, french beans, onion-tomato gravy', 270, '15 mins', 'Medley of carrots, beans, peas, and potatoes in rich onion-tomato masala. (Full: ₹150 / Half: ₹100)', 'Medley of carrots, beans, peas, and potatoes in rich onion-tomato masala. (Full: ₹150 / Half: ₹100)', NULL, NOW()),
('prod-bhindi-masala', 'Chatpata Bhindi Masala', 'Chatpata Bhindi Masala', 'chatpata-bhindi-masala', 'cat-sabji-special', 'Sabji', 1, 0, 0, 1, 1, 1, 180, 150, 180, 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=800&q=80', NULL, NULL, 'Fresh bhindi (okra), onions, amchur, cumin, coriander powder', 210, '15 mins', 'Tender okra sauteed with caramelized onions and dry mango spices. (Full: ₹150 / Half: ₹100)', 'Tender okra sauteed with caramelized onions and dry mango spices. (Full: ₹150 / Half: ₹100)', NULL, NOW()),
('prod-chole-masala', 'Punjabi Chole Masala', 'Punjabi Chole Masala', 'punjabi-chole-masala', 'cat-sabji-special', 'Sabji', 1, 1, 1, 1, 1, 1, 180, 150, 180, 'https://images.unsplash.com/photo-1626132647523-66f5bf380027?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1626132647523-66f5bf380027?auto=format&fit=crop&w=800&q=80', NULL, NULL, 'Kabuli chana, tomatoes, onions, chole masala, ginger', 320, '15 mins', 'Kabuli chickpeas cooked in a spiced gravy of tomatoes, onions, and garam masala. (Full: ₹150 / Half: ₹100)', 'Kabuli chickpeas cooked in a spiced gravy of tomatoes, onions, and garam masala. (Full: ₹150 / Half: ₹100)', NULL, NOW()),
('prod-aloo-matar', 'Homestyle Aloo Matar', 'Homestyle Aloo Matar', 'homestyle-aloo-matar', 'cat-sabji-special', 'Sabji', 1, 0, 0, 1, 1, 1, 170, 140, 170, 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=800&q=80', NULL, NULL, 'Potatoes, green peas, tomato gravy, coriander, spices', 250, '12 mins', 'Potatoes and tender peas simmered in a mildly spiced home curry. (Full: ₹140 / Half: ₹100)', 'Potatoes and tender peas simmered in a mildly spiced home curry. (Full: ₹140 / Half: ₹100)', NULL, NOW()),
('prod-gobhi-matar', 'Gobhi Matar Masala', 'Gobhi Matar Masala', 'gobhi-matar-masala', 'cat-sabji-special', 'Sabji', 1, 0, 0, 1, 1, 1, 170, 140, 170, 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=800&q=80', NULL, NULL, 'Cauliflower, green peas, ginger, cumin, turmeric', 230, '12 mins', 'Cauliflower florets and sweet peas tossed with roasted cumin and ginger. (Full: ₹140 / Half: ₹100)', 'Cauliflower florets and sweet peas tossed with roasted cumin and ginger. (Full: ₹140 / Half: ₹100)', NULL, NOW()),
('prod-aloo-gobhi-matar', 'Aloo Gobhi Matar Special', 'Aloo Gobhi Matar Special', 'aloo-gobhi-matar-special', 'cat-sabji-special', 'Sabji', 1, 0, 0, 1, 1, 1, 180, 150, 180, 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=800&q=80', NULL, NULL, 'Potatoes, cauliflower, peas, ginger, coriander, garam masala', 260, '15 mins', 'Classic North Indian dry curry of potatoes, cauliflower, and green peas. (Full: ₹150 / Half: ₹100)', 'Classic North Indian dry curry of potatoes, cauliflower, and green peas. (Full: ₹150 / Half: ₹100)', NULL, NOW()),
('prod-aloo-jeera', 'Hing Jeera Aloo', 'Hing Jeera Aloo', 'hing-jeera-aloo', 'cat-sabji-special', 'Sabji', 1, 0, 0, 1, 1, 1, 160, 130, 160, 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=800&q=80', NULL, NULL, 'Boiled potatoes, cumin seeds, hing, turmeric, fresh coriander', 220, '10 mins', 'Diced potatoes tempered with roasted cumin, hing, and green chillies. (Full: ₹130 / Half: ₹90)', 'Diced potatoes tempered with roasted cumin, hing, and green chillies. (Full: ₹130 / Half: ₹90)', NULL, NOW()),
('prod-dum-aloo', 'Kashmiri Dum Aloo', 'Kashmiri Dum Aloo', 'kashmiri-dum-aloo', 'cat-sabji-special', 'Sabji', 1, 1, 1, 1, 1, 1, 180, 150, 180, 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=800&q=80', NULL, NULL, 'Baby potatoes, yogurt, fennel powder, kashmiri chilli, dry ginger', 310, '15 mins', 'Baby potatoes simmered in a rich yogurt and fennel-infused tomato gravy. (Full: ₹150 / Half: ₹100)', 'Baby potatoes simmered in a rich yogurt and fennel-infused tomato gravy. (Full: ₹150 / Half: ₹100)', NULL, NOW()),
('prod-matar-paneer', 'Classic Matar Paneer', 'Classic Matar Paneer', 'classic-matar-paneer', 'cat-paneer-special', 'Paneer', 1, 0, 0, 1, 1, 1, 200, 170, 200, 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=800&q=80', NULL, NULL, 'Paneer, green peas, tomato-onion paste, cashew cream, garam masala', 380, '15 mins', 'Paneer cubes and green peas in a rich tomato, onion, and cashew gravy. (Full: ₹170 / Half: ₹110)', 'Paneer cubes and green peas in a rich tomato, onion, and cashew gravy. (Full: ₹170 / Half: ₹110)', NULL, NOW()),
('prod-paneer-masala', 'Dhaba Paneer Masala', 'Dhaba Paneer Masala', 'dhaba-paneer-masala', 'cat-paneer-special', 'Paneer', 1, 0, 0, 1, 1, 1, 200, 170, 200, 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=800&q=80', NULL, NULL, 'Paneer, bell peppers, onions, crushed coriander, desi spices', 390, '15 mins', 'Soft paneer cubes cooked in a spiced gravy with bell peppers and onions. (Full: ₹170 / Half: ₹110)', 'Soft paneer cubes cooked in a spiced gravy with bell peppers and onions. (Full: ₹170 / Half: ₹110)', NULL, NOW()),
('prod-palak-paneer', 'Lasooni Palak Paneer', 'Lasooni Palak Paneer', 'lasooni-palak-paneer', 'cat-paneer-special', 'Paneer', 1, 0, 0, 1, 1, 1, 210, 180, 210, 'https://images.unsplash.com/photo-1613292443284-8d10ef9383fe?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1613292443284-8d10ef9383fe?auto=format&fit=crop&w=800&q=80', NULL, NULL, 'Spinach puree, fresh paneer, garlic, cream, green chillies', 340, '15 mins', 'Fresh spinach puree tempered with garlic and tossed with tender paneer. (Full: ₹180 / Half: ₹120)', 'Fresh spinach puree tempered with garlic and tossed with tender paneer. (Full: ₹180 / Half: ₹120)', NULL, NOW()),
('prod-kadhai-paneer', 'Spicy Kadhai Paneer', 'Spicy Kadhai Paneer', 'spicy-kadhai-paneer', 'cat-paneer-special', 'Paneer', 1, 1, 1, 1, 1, 1, 230, 190, 230, 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=800&q=80', NULL, NULL, 'Paneer, capsicum, onions, coriander seeds, dry chillies, tomatoes', 410, '15 mins', 'Paneer and capsicum tossed in freshly ground kadhai coriander-pepper masala. (Full: ₹190 / Half: ₹130)', 'Paneer and capsicum tossed in freshly ground kadhai coriander-pepper masala. (Full: ₹190 / Half: ₹130)', NULL, NOW()),
('prod-paneer-kolhapuri', 'Fiery Paneer Kolhapuri', 'Fiery Paneer Kolhapuri', 'fiery-paneer-kolhapuri', 'cat-paneer-special', 'Paneer', 1, 0, 0, 1, 1, 1, 230, 190, 230, 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=800&q=80', NULL, NULL, 'Paneer, kolhapuri masala, roasted coconut, red chillies', 420, '15 mins', 'Spiced gravy with dry red chillies, roasted coconut, and whole spices. (Full: ₹190 / Half: ₹130)', 'Spiced gravy with dry red chillies, roasted coconut, and whole spices. (Full: ₹190 / Half: ₹130)', NULL, NOW()),
('prod-paneer-butter-masala', 'Royal Paneer Butter Masala', 'Royal Paneer Butter Masala', 'royal-paneer-butter-masala', 'cat-paneer-special', 'Paneer', 1, 1, 1, 1, 1, 1, 250, 210, 250, 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=800&q=80', NULL, NULL, 'Fresh paneer, butter, fresh cream, ripe tomatoes, cashews, kasoori methi', 450, '15 mins', 'Silky rich tomato butter makhani gravy with cream and kasoori methi. (Full: ₹210 / Half: ₹140)', 'Silky rich tomato butter makhani gravy with cream and kasoori methi. (Full: ₹210 / Half: ₹140)', NULL, NOW()),
('prod-roasted-papad', 'Tawa Roasted Papad (2 Pcs)', 'Tawa Roasted Papad (2 Pcs)', 'tawa-roasted-papad', 'cat-salad-papad-raita', 'Papad', 1, 0, 0, 1, 1, 0, 25, 20, 25, 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80', NULL, NULL, 'Urad dal, black pepper, asafoetida', 60, '5 mins', 'Crispy roasted urad dal papad.', 'Crispy roasted urad dal papad.', NULL, NOW()),
('prod-fried-papad', 'Golden Fried Papad', 'Golden Fried Papad', 'golden-fried-papad', 'cat-salad-papad-raita', 'Papad', 1, 0, 0, 1, 1, 0, 35, 30, 35, 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80', NULL, NULL, 'Papad, vegetable oil', 110, '5 mins', 'Crisp deep-fried savory papad.', 'Crisp deep-fried savory papad.', NULL, NOW()),
('prod-masala-papad', 'Chatpata Masala Papad', 'Chatpata Masala Papad', 'chatpata-masala-papad', 'cat-salad-papad-raita', 'Papad', 1, 1, 1, 1, 1, 1, 65, 50, 65, 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80', NULL, NULL, 'Papad, onions, tomatoes, coriander, lemon, chaat masala', 140, '5 mins', 'Fried papad topped with diced onions, tomatoes, coriander, and spicy chaat masala.', 'Fried papad topped with diced onions, tomatoes, coriander, and spicy chaat masala.', NULL, NOW()),
('prod-onion-salad', 'Laccha Onion Salad', 'Laccha Onion Salad', 'laccha-onion-salad', 'cat-salad-papad-raita', 'Salad', 1, 0, 0, 1, 1, 0, 60, 50, 60, 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80', NULL, NULL, 'Red onions, green chillies, lemon wedges, chaat masala', 50, '5 mins', 'Sliced onion rings with green chillies, lemon, and chaat masala.', 'Sliced onion rings with green chillies, lemon, and chaat masala.', NULL, NOW()),
('prod-green-salad', 'Fresh Green Garden Salad', 'Fresh Green Garden Salad', 'fresh-green-garden-salad', 'cat-salad-papad-raita', 'Salad', 1, 0, 0, 1, 1, 0, 75, 60, 75, 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80', NULL, NULL, 'Cucumber, tomatoes, carrots, beetroot, lemon', 70, '5 mins', 'Slices of cucumber, tomato, carrot, beetroot, and lemon.', 'Slices of cucumber, tomato, carrot, beetroot, and lemon.', NULL, NOW()),
('prod-plain-raita', 'Whisked Plain Curd / Raita', 'Whisked Plain Curd / Raita', 'whisked-plain-curd-raita', 'cat-salad-papad-raita', 'Raita', 1, 0, 0, 1, 1, 0, 70, 60, 70, 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80', NULL, NULL, 'Curd (dahi), roasted cumin powder, black salt', 120, '5 mins', 'Fresh chilled curd whisked with roasted jeera and black salt.', 'Fresh chilled curd whisked with roasted jeera and black salt.', NULL, NOW()),
('prod-boondi-raita', 'Crunchy Boondi Raita', 'Crunchy Boondi Raita', 'crunchy-boondi-raita', 'cat-salad-papad-raita', 'Raita', 1, 1, 1, 1, 1, 1, 85, 70, 85, 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80', NULL, NULL, 'Fresh yogurt, spiced boondi, mint, roasted cumin', 160, '5 mins', 'Chilled yogurt mixed with crispy spiced gram flour pearls (boondi).', 'Chilled yogurt mixed with crispy spiced gram flour pearls (boondi).', NULL, NOW()),
('prod-veg-raita', 'Mixed Vegetable Raita', 'Mixed Vegetable Raita', 'mixed-vegetable-raita', 'cat-salad-papad-raita', 'Raita', 1, 0, 0, 1, 1, 1, 85, 70, 85, 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80', NULL, NULL, 'Curd, diced cucumber, onions, tomatoes, chaat masala', 140, '5 mins', 'Beaten curd with chopped cucumber, tomato, onion, and mint.', 'Beaten curd with chopped cucumber, tomato, onion, and mint.', NULL, NOW()),
('prod-onion-raita', 'Chilled Onion Raita', 'Chilled Onion Raita', 'chilled-onion-raita', 'cat-salad-papad-raita', 'Raita', 1, 0, 0, 1, 1, 0, 85, 70, 85, 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80', NULL, NULL, 'Curd, onions, roasted jeera, salt', 130, '5 mins', 'Crisp diced onions in seasoned curd with roasted cumin.', 'Crisp diced onions in seasoned curd with roasted cumin.', NULL, NOW()),
('prod-regular-tea', 'Regular Masala Chai', 'Regular Masala Chai', 'regular-masala-chai', 'cat-tea-coffee', 'Tea', 1, 0, 0, 1, 1, 0, 15, 10, 15, 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80', NULL, NULL, 'Assam tea leaves, milk, crushed ginger, cardamom', 90, '5 mins', 'Freshly brewed Indian milk tea with ginger and cardamom.', 'Freshly brewed Indian milk tea with ginger and cardamom.', NULL, NOW()),
('prod-special-chai', 'Raghav Special Kulhad Chai', 'Raghav Special Kulhad Chai', 'raghav-special-kulhad-chai', 'cat-tea-coffee', 'Tea', 1, 1, 1, 1, 1, 1, 20, 15, 20, 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80', NULL, NULL, 'Tea leaves, full-cream milk, ginger, cardamom, clove, cinnamon', 110, '7 mins', 'Clay-cup (kulhad) boiled signature tea with crushed spices.', 'Clay-cup (kulhad) boiled signature tea with crushed spices.', NULL, NOW()),
('prod-black-tea', 'Aromatic Black Tea', 'Aromatic Black Tea', 'aromatic-black-tea', 'cat-tea-coffee', 'Tea', 1, 0, 0, 1, 1, 0, 20, 15, 20, 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80', NULL, NULL, 'Tea leaves, warm water, lemon zest', 15, '5 mins', 'Light and soothing brewed black tea liquor.', 'Light and soothing brewed black tea liquor.', NULL, NOW()),
('prod-lemon-tea', 'Honey Lemon Tea', 'Honey Lemon Tea', 'honey-lemon-tea', 'cat-tea-coffee', 'Tea', 1, 0, 0, 1, 1, 0, 25, 20, 25, 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80', NULL, NULL, 'Black tea, fresh lemon juice, honey, mint', 45, '5 mins', 'Fresh lemon juice infused black tea with mint.', 'Fresh lemon juice infused black tea with mint.', NULL, NOW()),
('prod-hot-coffee', 'Rich Hot Filter Coffee', 'Rich Hot Filter Coffee', 'rich-hot-filter-coffee', 'cat-tea-coffee', 'Coffee', 1, 0, 0, 1, 1, 1, 30, 20, 30, 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80', NULL, NULL, 'Coffee decoction, hot milk, sugar', 130, '5 mins', 'Frothy, aromatic freshly brewed hot milk coffee.', 'Frothy, aromatic freshly brewed hot milk coffee.', NULL, NOW()),
('prod-punjabi-lassi', 'Punjabi Sweet Lassi', 'Punjabi Sweet Lassi', 'punjabi-sweet-lassi', 'cat-beverages-desserts', 'Beverages', 1, 1, 1, 1, 1, 1, 40, 30, 40, 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80', NULL, NULL, 'Fresh yogurt, sugar, cardamom, malai', 240, '5 mins', 'Thick, chilled sweet yogurt drink flavored with cardamom.', 'Thick, chilled sweet yogurt drink flavored with cardamom.', NULL, NOW()),
('prod-mattha-chaach', 'Spiced Desi Mattha (Chaach)', 'Spiced Desi Mattha (Chaach)', 'spiced-desi-mattha-chaach', 'cat-beverages-desserts', 'Beverages', 1, 1, 1, 1, 1, 0, 25, 20, 25, 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80', NULL, NULL, 'Buttermilk, roasted cumin, black salt, fresh mint', 70, '5 mins', 'Churned refreshing buttermilk with roasted cumin, mint, and black salt.', 'Churned refreshing buttermilk with roasted cumin, mint, and black salt.', NULL, NOW()),
('prod-virgin-mojito', 'Sparkling Virgin Mojito', 'Sparkling Virgin Mojito', 'sparkling-virgin-mojito', 'cat-beverages-desserts', 'Beverages', 1, 0, 0, 1, 1, 1, 80, 60, 80, 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80', NULL, NULL, 'Club soda, fresh mint, lime wedges, simple syrup', 110, '5 mins', 'Soda cooler muddled with fresh mint leaves and lime wedges.', 'Soda cooler muddled with fresh mint leaves and lime wedges.', NULL, NOW()),
('prod-banana-shake', 'Fresh Banana Milkshake', 'Fresh Banana Milkshake', 'fresh-banana-milkshake', 'cat-beverages-desserts', 'Beverages', 1, 0, 0, 1, 1, 1, 80, 60, 80, 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80', NULL, NULL, 'Bananas, chilled milk, honey, nuts', 250, '5 mins', 'Thick blended milkshake made with ripe bananas and chilled milk.', 'Thick blended milkshake made with ripe bananas and chilled milk.', NULL, NOW()),
('prod-cold-coffee', 'Chilled Cafe Cold Coffee', 'Chilled Cafe Cold Coffee', 'chilled-cafe-cold-coffee', 'cat-beverages-desserts', 'Beverages', 1, 1, 1, 1, 1, 1, 100, 80, 100, 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=800&q=80', NULL, NULL, 'Coffee, chilled milk, chocolate syrup, ice cubes', 220, '5 mins', 'Blended iced cold coffee. (Add Vanilla Ice Cream scoop for +₹20).', 'Blended iced cold coffee. (Add Vanilla Ice Cream scoop for +₹20).', NULL, NOW()),
('prod-gulab-jamun', 'Hot Gulab Jamun (1 Pc)', 'Hot Gulab Jamun (1 Pc)', 'hot-gulab-jamun', 'cat-beverages-desserts', 'Desserts', 1, 1, 1, 1, 1, 0, 25, 20, 25, 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=800&q=80', NULL, NULL, 'Khoya, sugar syrup, rose water, cardamom', 150, '5 mins', 'Warm, melt-in-mouth milk solid dumplings in rose sugar syrup (Per piece).', 'Warm, melt-in-mouth milk solid dumplings in rose sugar syrup (Per piece).', NULL, NOW())
ON DUPLICATE KEY UPDATE `name`=VALUES(`name`), `price`=VALUES(`price`), `image`=VALUES(`image`);

-- 5. Restaurant Dining Tables (12 Tables)
INSERT INTO `RestaurantTable` (`id`, `tableNo`, `name`, `seats`, `status`, `activeOrder`, `displayOrder`, `createdAt`, `updatedAt`) VALUES
('tbl-1', 'Table-1', 'Table 1', 4, 'AVAILABLE', NULL, 1, NOW(), NOW()),
('tbl-2', 'Table-2', 'Table 2', 4, 'AVAILABLE', NULL, 2, NOW(), NOW()),
('tbl-3', 'Table-3', 'Table 3', 4, 'AVAILABLE', NULL, 3, NOW(), NOW()),
('tbl-4', 'Table-4', 'Table 4', 6, 'AVAILABLE', NULL, 4, NOW(), NOW()),
('tbl-5', 'Table-5', 'Table 5', 4, 'AVAILABLE', NULL, 5, NOW(), NOW()),
('tbl-6', 'Table-6', 'Table 6', 4, 'AVAILABLE', NULL, 6, NOW(), NOW()),
('tbl-7', 'Table-7', 'Table 7', 4, 'AVAILABLE', NULL, 7, NOW(), NOW()),
('tbl-8', 'Table-8', 'Table 8', 6, 'AVAILABLE', NULL, 8, NOW(), NOW()),
('tbl-9', 'Table-9', 'Table 9', 4, 'AVAILABLE', NULL, 9, NOW(), NOW()),
('tbl-10', 'Table-10', 'Table 10', 4, 'AVAILABLE', NULL, 10, NOW(), NOW()),
('tbl-11', 'Table-11', 'Table 11', 4, 'AVAILABLE', NULL, 11, NOW(), NOW()),
('tbl-12', 'Table-12', 'Table 12', 6, 'AVAILABLE', NULL, 12, NOW(), NOW())
ON DUPLICATE KEY UPDATE `name`=VALUES(`name`), `seats`=VALUES(`seats`);

-- 6. Coupons
INSERT INTO `Coupon` (`id`, `code`, `type`, `value`, `minOrder`, `maxDiscount`, `desc`, `active`, `createdAt`) VALUES
('cpn-welcome', 'WELCOME50', 'PERCENT', 20.0, 199, 100, 'Get 20% OFF up to ₹100 on your first order above ₹199!', 1, NOW()),
('cpn-raghav', 'RAGHAV10', 'FLAT', 50.0, 300, 50, 'Flat ₹50 OFF on orders above ₹300', 1, NOW())
ON DUPLICATE KEY UPDATE `desc`=VALUES(`desc`);

SET FOREIGN_KEY_CHECKS = 1;

-- =========================================================================
-- END OF RAGHAV RASOI DATABASE DUMP
-- =========================================================================
