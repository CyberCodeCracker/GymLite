-- ============================================
-- CLEAR EXISTING DATA
-- ============================================
-- Delete in correct order due to foreign key constraints
delete from product_image;
delete from product;
delete from category;

-- Reset sequences
alter sequence category_seq restart with 1;
alter sequence product_seq restart with 1;
alter sequence product_image_seq restart with 1;

-- ============================================
-- INSERT CATEGORIES
-- ============================================
insert into category (id, name, description) values
                                                 (nextval('category_seq'), 'Free Weights', 'Dumbbells, barbells and weight plates for strength training'),
                                                 (nextval('category_seq'), 'Cardio Machines', 'Treadmills, bikes, and rowing machines for cardiovascular fitness'),
                                                 (nextval('category_seq'), 'Strength Machines', 'Guided weight machines for targeted muscle training'),
                                                 (nextval('category_seq'), 'Accessories', 'Gym accessories, mats, bands, and small training equipment'),
                                                 (nextval('category_seq'), 'Functional Training', 'Equipment for functional fitness and cross training');

-- ============================================
-- INSERT PRODUCTS - Free Weights
-- ============================================
insert into product (id, name, description, available_quantity, price, category_id) values
                                                                                        (nextval('product_seq'), 'Adjustable Dumbbells Set', 'Premium adjustable dumbbell set with quick-lock mechanism, 5-52.5 lbs per dumbbell', 25, 349.99,
                                                                                         (select id from category where name = 'Free Weights')),
                                                                                        (nextval('product_seq'), 'Olympic Barbell 20kg', 'Professional grade Olympic barbell with rotating sleeves and knurled grip', 15, 299.99,
                                                                                         (select id from category where name = 'Free Weights')),
                                                                                        (nextval('product_seq'), 'Rubber Weight Plates Set', 'Complete set of Olympic rubber-coated weight plates (2.5kg to 25kg)', 30, 449.99,
                                                                                         (select id from category where name = 'Free Weights')),
                                                                                        (nextval('product_seq'), 'Hex Dumbbell Set', 'Set of 6 pairs hex dumbbells ranging from 5kg to 30kg', 18, 599.99,
                                                                                         (select id from category where name = 'Free Weights')),
                                                                                        (nextval('product_seq'), 'EZ Curl Bar', 'Ergonomic EZ curl bar for bicep and tricep exercises', 22, 89.99,
                                                                                         (select id from category where name = 'Free Weights'));

-- ============================================
-- INSERT PRODUCTS - Cardio Machines
-- ============================================
insert into product (id, name, description, available_quantity, price, category_id) values
                                                                                        (nextval('product_seq'), 'Commercial Treadmill Pro', 'Heavy-duty commercial treadmill with 15% incline and 12 preset programs', 8, 2499.00,
                                                                                         (select id from category where name = 'Cardio Machines')),
                                                                                        (nextval('product_seq'), 'Spin Bike Elite', 'Professional indoor cycling bike with magnetic resistance and performance monitor', 12, 899.00,
                                                                                         (select id from category where name = 'Cardio Machines')),
                                                                                        (nextval('product_seq'), 'Air Rowing Machine', 'Competition-grade air resistance rower with PM5 performance monitor', 10, 1299.00,
                                                                                         (select id from category where name = 'Cardio Machines')),
                                                                                        (nextval('product_seq'), 'Elliptical Cross Trainer', 'Low-impact elliptical with 20 resistance levels and heart rate monitoring', 9, 1599.00,
                                                                                         (select id from category where name = 'Cardio Machines')),
                                                                                        (nextval('product_seq'), 'Recumbent Exercise Bike', 'Comfortable recumbent bike with back support and adjustable seat', 14, 749.00,
                                                                                         (select id from category where name = 'Cardio Machines'));

-- ============================================
-- INSERT PRODUCTS - Strength Machines
-- ============================================
insert into product (id, name, description, available_quantity, price, category_id) values
                                                                                        (nextval('product_seq'), 'Leg Press Machine', 'Heavy-duty 45-degree leg press with 1000 lbs weight capacity', 5, 2899.99,
                                                                                         (select id from category where name = 'Strength Machines')),
                                                                                        (nextval('product_seq'), 'Lat Pulldown Station', 'Commercial lat pulldown and low row combo machine', 6, 1999.99,
                                                                                         (select id from category where name = 'Strength Machines')),
                                                                                        (nextval('product_seq'), 'Chest Press Machine', 'Plate-loaded chest press with adjustable seat and multiple grip positions', 7, 2199.99,
                                                                                         (select id from category where name = 'Strength Machines')),
                                                                                        (nextval('product_seq'), 'Cable Crossover Machine', 'Dual adjustable pulley system for versatile cable exercises', 4, 3499.99,
                                                                                         (select id from category where name = 'Strength Machines')),
                                                                                        (nextval('product_seq'), 'Smith Machine', 'Multi-functional Smith machine with safety catches and pullup bar', 3, 2699.99,
                                                                                         (select id from category where name = 'Strength Machines'));

-- ============================================
-- INSERT PRODUCTS - Accessories
-- ============================================
insert into product (id, name, description, available_quantity, price, category_id) values
                                                                                        (nextval('product_seq'), 'Resistance Bands Set', 'Premium latex resistance band set with 5 levels and door anchor', 50, 39.99,
                                                                                         (select id from category where name = 'Accessories')),
                                                                                        (nextval('product_seq'), 'Premium Yoga Mat', 'Extra-thick 6mm non-slip yoga mat with carrying strap', 60, 34.99,
                                                                                         (select id from category where name = 'Accessories')),
                                                                                        (nextval('product_seq'), 'Lifting Gloves Pro', 'Padded weightlifting gloves with wrist support and grip enhancement', 40, 24.99,
                                                                                         (select id from category where name = 'Accessories')),
                                                                                        (nextval('product_seq'), 'Foam Roller Set', 'High-density foam roller with massage ball and stretch strap', 35, 44.99,
                                                                                         (select id from category where name = 'Accessories')),
                                                                                        (nextval('product_seq'), 'Jump Rope Speed', 'Adjustable speed jump rope with ball bearing and comfort handles', 55, 19.99,
                                                                                         (select id from category where name = 'Accessories'));

-- ============================================
-- INSERT PRODUCTS - Functional Training
-- ============================================
insert into product (id, name, description, available_quantity, price, category_id) values
                                                                                        (nextval('product_seq'), 'Kettlebell 16kg', 'Cast iron competition kettlebell with powder-coated finish', 20, 74.99,
                                                                                         (select id from category where name = 'Functional Training')),
                                                                                        (nextval('product_seq'), 'Battle Rope 15m', 'Heavy-duty 15-meter battle rope for cardio and strength training', 10, 149.99,
                                                                                         (select id from category where name = 'Functional Training')),
                                                                                        (nextval('product_seq'), 'Plyometric Box Set', '3-in-1 wooden plyo box (20/24/30 inch heights) for box jumps', 14, 189.99,
                                                                                         (select id from category where name = 'Functional Training')),
                                                                                        (nextval('product_seq'), 'Slam Ball 20kg', 'Non-bounce weighted slam ball for explosive power training', 16, 89.99,
                                                                                         (select id from category where name = 'Functional Training')),
                                                                                        (nextval('product_seq'), 'Suspension Trainer', 'Professional suspension training system with door anchor and workout guide', 28, 129.99,
                                                                                         (select id from category where name = 'Functional Training'));

-- ============================================
-- INSERT PRODUCT IMAGES (3 per product)
-- ============================================

-- Free Weights Images
-- Adjustable Dumbbells
insert into product_image (id, image_url, display_order, product_id) values
                                                                         (nextval('product_image_seq'), 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800', 0, (select id from product where name = 'Adjustable Dumbbells Set')),
                                                                         (nextval('product_image_seq'), 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=800', 1, (select id from product where name = 'Adjustable Dumbbells Set')),
                                                                         (nextval('product_image_seq'), 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800', 2, (select id from product where name = 'Adjustable Dumbbells Set'));

-- Olympic Barbell
insert into product_image (id, image_url, display_order, product_id) values
                                                                         (nextval('product_image_seq'), 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800', 0, (select id from product where name = 'Olympic Barbell 20kg')),
                                                                         (nextval('product_image_seq'), 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800', 1, (select id from product where name = 'Olympic Barbell 20kg')),
                                                                         (nextval('product_image_seq'), 'https://images.unsplash.com/photo-1605296867304-46d5465a13f1?w=800', 2, (select id from product where name = 'Olympic Barbell 20kg'));

-- Weight Plates
insert into product_image (id, image_url, display_order, product_id) values
                                                                         (nextval('product_image_seq'), 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800', 0, (select id from product where name = 'Rubber Weight Plates Set')),
                                                                         (nextval('product_image_seq'), 'https://images.unsplash.com/photo-1605296867424-35fc25c9212a?w=800', 1, (select id from product where name = 'Rubber Weight Plates Set')),
                                                                         (nextval('product_image_seq'), 'https://images.unsplash.com/photo-1623874514711-0f321325f318?w=800', 2, (select id from product where name = 'Rubber Weight Plates Set'));

-- Hex Dumbbells
insert into product_image (id, image_url, display_order, product_id) values
                                                                         (nextval('product_image_seq'), 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=800', 0, (select id from product where name = 'Hex Dumbbell Set')),
                                                                         (nextval('product_image_seq'), 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800', 1, (select id from product where name = 'Hex Dumbbell Set')),
                                                                         (nextval('product_image_seq'), 'https://images.unsplash.com/photo-1590487988256-9ed24133863e?w=800', 2, (select id from product where name = 'Hex Dumbbell Set'));

-- EZ Curl Bar
insert into product_image (id, image_url, display_order, product_id) values
                                                                         (nextval('product_image_seq'), 'https://images.unsplash.com/photo-1532384748853-8f54a8f476e2?w=800', 0, (select id from product where name = 'EZ Curl Bar')),
                                                                         (nextval('product_image_seq'), 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800', 1, (select id from product where name = 'EZ Curl Bar')),
                                                                         (nextval('product_image_seq'), 'https://images.unsplash.com/photo-1605296867424-35fc25c9212a?w=800', 2, (select id from product where name = 'EZ Curl Bar'));

-- Cardio Machines Images
-- Treadmill
insert into product_image (id, image_url, display_order, product_id) values
                                                                         (nextval('product_image_seq'), 'https://images.unsplash.com/photo-1576678927484-cc907957088c?w=800', 0, (select id from product where name = 'Commercial Treadmill Pro')),
                                                                         (nextval('product_image_seq'), 'https://images.unsplash.com/photo-1538805060514-97d9cc17730c?w=800', 1, (select id from product where name = 'Commercial Treadmill Pro')),
                                                                         (nextval('product_image_seq'), 'https://images.unsplash.com/photo-1593079831268-3381b0db4a77?w=800', 2, (select id from product where name = 'Commercial Treadmill Pro'));

-- Spin Bike
insert into product_image (id, image_url, display_order, product_id) values
                                                                         (nextval('product_image_seq'), 'https://images.unsplash.com/photo-1576678927484-cc907957088c?w=800', 0, (select id from product where name = 'Spin Bike Elite')),
                                                                         (nextval('product_image_seq'), 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800', 1, (select id from product where name = 'Spin Bike Elite')),
                                                                         (nextval('product_image_seq'), 'https://images.unsplash.com/photo-1605296867304-46d5465a13f1?w=800', 2, (select id from product where name = 'Spin Bike Elite'));

-- Rowing Machine
insert into product_image (id, image_url, display_order, product_id) values
                                                                         (nextval('product_image_seq'), 'https://images.unsplash.com/photo-1590487988256-9ed24133863e?w=800', 0, (select id from product where name = 'Air Rowing Machine')),
                                                                         (nextval('product_image_seq'), 'https://images.unsplash.com/photo-1605296867304-46d5465a13f1?w=800', 1, (select id from product where name = 'Air Rowing Machine')),
                                                                         (nextval('product_image_seq'), 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800', 2, (select id from product where name = 'Air Rowing Machine'));

-- Elliptical
insert into product_image (id, image_url, display_order, product_id) values
                                                                         (nextval('product_image_seq'), 'https://images.unsplash.com/photo-1593079831268-3381b0db4a77?w=800', 0, (select id from product where name = 'Elliptical Cross Trainer')),
                                                                         (nextval('product_image_seq'), 'https://images.unsplash.com/photo-1576678927484-cc907957088c?w=800', 1, (select id from product where name = 'Elliptical Cross Trainer')),
                                                                         (nextval('product_image_seq'), 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800', 2, (select id from product where name = 'Elliptical Cross Trainer'));

-- Recumbent Bike
insert into product_image (id, image_url, display_order, product_id) values
                                                                         (nextval('product_image_seq'), 'https://images.unsplash.com/photo-1605296867424-35fc25c9212a?w=800', 0, (select id from product where name = 'Recumbent Exercise Bike')),
                                                                         (nextval('product_image_seq'), 'https://images.unsplash.com/photo-1538805060514-97d9cc17730c?w=800', 1, (select id from product where name = 'Recumbent Exercise Bike')),
                                                                         (nextval('product_image_seq'), 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800', 2, (select id from product where name = 'Recumbent Exercise Bike'));

-- Strength Machines Images
-- Leg Press
insert into product_image (id, image_url, display_order, product_id) values
                                                                         (nextval('product_image_seq'), 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800', 0, (select id from product where name = 'Leg Press Machine')),
                                                                         (nextval('product_image_seq'), 'https://images.unsplash.com/photo-1593079831268-3381b0db4a77?w=800', 1, (select id from product where name = 'Leg Press Machine')),
                                                                         (nextval('product_image_seq'), 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800', 2, (select id from product where name = 'Leg Press Machine'));

-- Lat Pulldown
insert into product_image (id, image_url, display_order, product_id) values
                                                                         (nextval('product_image_seq'), 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800', 0, (select id from product where name = 'Lat Pulldown Station')),
                                                                         (nextval('product_image_seq'), 'https://images.unsplash.com/photo-1605296867304-46d5465a13f1?w=800', 1, (select id from product where name = 'Lat Pulldown Station')),
                                                                         (nextval('product_image_seq'), 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800', 2, (select id from product where name = 'Lat Pulldown Station'));

-- Chest Press
insert into product_image (id, image_url, display_order, product_id) values
                                                                         (nextval('product_image_seq'), 'https://images.unsplash.com/photo-1590487988256-9ed24133863e?w=800', 0, (select id from product where name = 'Chest Press Machine')),
                                                                         (nextval('product_image_seq'), 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800', 1, (select id from product where name = 'Chest Press Machine')),
                                                                         (nextval('product_image_seq'), 'https://images.unsplash.com/photo-1605296867424-35fc25c9212a?w=800', 2, (select id from product where name = 'Chest Press Machine'));

-- Cable Crossover
insert into product_image (id, image_url, display_order, product_id) values
                                                                         (nextval('product_image_seq'), 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800', 0, (select id from product where name = 'Cable Crossover Machine')),
                                                                         (nextval('product_image_seq'), 'https://images.unsplash.com/photo-1593079831268-3381b0db4a77?w=800', 1, (select id from product where name = 'Cable Crossover Machine')),
                                                                         (nextval('product_image_seq'), 'https://images.unsplash.com/photo-1538805060514-97d9cc17730c?w=800', 2, (select id from product where name = 'Cable Crossover Machine'));

-- Smith Machine
insert into product_image (id, image_url, display_order, product_id) values
                                                                         (nextval('product_image_seq'), 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800', 0, (select id from product where name = 'Smith Machine')),
                                                                         (nextval('product_image_seq'), 'https://images.unsplash.com/photo-1605296867304-46d5465a13f1?w=800', 1, (select id from product where name = 'Smith Machine')),
                                                                         (nextval('product_image_seq'), 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800', 2, (select id from product where name = 'Smith Machine'));

-- Accessories Images
-- Resistance Bands
insert into product_image (id, image_url, display_order, product_id) values
                                                                         (nextval('product_image_seq'), 'https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=800', 0, (select id from product where name = 'Resistance Bands Set')),
                                                                         (nextval('product_image_seq'), 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800', 1, (select id from product where name = 'Resistance Bands Set')),
                                                                         (nextval('product_image_seq'), 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800', 2, (select id from product where name = 'Resistance Bands Set'));

-- Yoga Mat
insert into product_image (id, image_url, display_order, product_id) values
                                                                         (nextval('product_image_seq'), 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800', 0, (select id from product where name = 'Premium Yoga Mat')),
                                                                         (nextval('product_image_seq'), 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800', 1, (select id from product where name = 'Premium Yoga Mat')),
                                                                         (nextval('product_image_seq'), 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800', 2, (select id from product where name = 'Premium Yoga Mat'));

-- Lifting Gloves
insert into product_image (id, image_url, display_order, product_id) values
                                                                         (nextval('product_image_seq'), 'https://images.unsplash.com/photo-1532384748853-8f54a8f476e2?w=800', 0, (select id from product where name = 'Lifting Gloves Pro')),
                                                                         (nextval('product_image_seq'), 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800', 1, (select id from product where name = 'Lifting Gloves Pro')),
                                                                         (nextval('product_image_seq'), 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800', 2, (select id from product where name = 'Lifting Gloves Pro'));

-- Foam Roller
insert into product_image (id, image_url, display_order, product_id) values
                                                                         (nextval('product_image_seq'), 'https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=800', 0, (select id from product where name = 'Foam Roller Set')),
                                                                         (nextval('product_image_seq'), 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800', 1, (select id from product where name = 'Foam Roller Set')),
                                                                         (nextval('product_image_seq'), 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800', 2, (select id from product where name = 'Foam Roller Set'));

-- Jump Rope
insert into product_image (id, image_url, display_order, product_id) values
                                                                         (nextval('product_image_seq'), 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800', 0, (select id from product where name = 'Jump Rope Speed')),
                                                                         (nextval('product_image_seq'), 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800', 1, (select id from product where name = 'Jump Rope Speed')),
                                                                         (nextval('product_image_seq'), 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800', 2, (select id from product where name = 'Jump Rope Speed'));

-- Functional Training Images
-- Kettlebell
insert into product_image (id, image_url, display_order, product_id) values
                                                                         (nextval('product_image_seq'), 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800', 0, (select id from product where name = 'Kettlebell 16kg')),
                                                                         (nextval('product_image_seq'), 'https://images.unsplash.com/photo-1605296867424-35fc25c9212a?w=800', 1, (select id from product where name = 'Kettlebell 16kg')),
                                                                         (nextval('product_image_seq'), 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800', 2, (select id from product where name = 'Kettlebell 16kg'));

-- Battle Rope
insert into product_image (id, image_url, display_order, product_id) values
                                                                         (nextval('product_image_seq'), 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800', 0, (select id from product where name = 'Battle Rope 15m')),
                                                                         (nextval('product_image_seq'), 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800', 1, (select id from product where name = 'Battle Rope 15m')),
                                                                         (nextval('product_image_seq'), 'https://images.unsplash.com/photo-1593079831268-3381b0db4a77?w=800', 2, (select id from product where name = 'Battle Rope 15m'));

-- Plyo Box
insert into product_image (id, image_url, display_order, product_id) values
                                                                         (nextval('product_image_seq'), 'https://images.unsplash.com/photo-1590487988256-9ed24133863e?w=800', 0, (select id from product where name = 'Plyometric Box Set')),
                                                                         (nextval('product_image_seq'), 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800', 1, (select id from product where name = 'Plyometric Box Set')),
                                                                         (nextval('product_image_seq'), 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800', 2, (select id from product where name = 'Plyometric Box Set'));

-- Slam Ball
insert into product_image (id, image_url, display_order, product_id) values
                                                                         (nextval('product_image_seq'), 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800', 0, (select id from product where name = 'Slam Ball 20kg')),
                                                                         (nextval('product_image_seq'), 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800', 1, (select id from product where name = 'Slam Ball 20kg')),
                                                                         (nextval('product_image_seq'), 'https://images.unsplash.com/photo-1605296867424-35fc25c9212a?w=800', 2, (select id from product where name = 'Slam Ball 20kg'));

-- Suspension Trainer
insert into product_image (id, image_url, display_order, product_id) values
                                                                         (nextval('product_image_seq'), 'https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=800', 0, (select id from product where name = 'Suspension Trainer')),
                                                                         (nextval('product_image_seq'), 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800', 1, (select id from product where name = 'Suspension Trainer')),
                                                                         (nextval('product_image_seq'), 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800', 2, (select id from product where name = 'Suspension Trainer'));

-- ============================================
-- VERIFICATION QUERIES
-- ============================================
-- Verify data was inserted correctly
select 'Categories' as table_name, count(*) as count from category
union all
select 'Products', count(*) from product
union all
select 'Product Images', count(*) from product_image;

-- Show products with image count
select
    p.id,
    p.name,
    c.name as category,
    count(pi.id) as image_count
from product p
         left join category c on p.category_id = c.id
         left join product_image pi on p.id = pi.product_id
group by p.id, p.name, c.name
order by p.id;