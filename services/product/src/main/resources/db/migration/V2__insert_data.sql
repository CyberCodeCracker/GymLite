-- Categories
insert into product.public.category (id, name, description) values
                                                 (nextval('category_seq'), 'Free Weights', 'Dumbbells, barbells and weight plates'),
                                                 (nextval('category_seq'), 'Cardio Machines', 'Machines for cardiovascular training'),
                                                 (nextval('category_seq'), 'Strength Machines', 'Guided machines for strength training'),
                                                 (nextval('category_seq'), 'Accessories', 'Gym accessories and small equipment'),
                                                 (nextval('category_seq'), 'Functional Training', 'Equipment for functional and cross training');

-- Products
insert into product.public.product (id, name, description, available_quantity, price, category_id) values
-- Free Weights
(nextval('product_seq'), 'Adjustable Dumbbells Set', 'Pair of adjustable dumbbells with plates', 25, 149.99,
 (select id from product.public.category where name = 'Free Weights')),
(nextval('product_seq'), 'Olympic Barbell', '20kg Olympic standard barbell', 15, 199.99,
 (select id from product.public.category where name = 'Free Weights')),
(nextval('product_seq'), 'Weight Plates Set', 'Set of rubber-coated weight plates', 30, 249.99,
 (select id from product.public.category where name = 'Free Weights')),

-- Cardio Machines
(nextval('product_seq'), 'Treadmill Pro X', 'High-performance treadmill with incline', 8, 1299.00,
 (select id from product.public.category where name = 'Cardio Machines')),
(nextval('product_seq'), 'Exercise Bike', 'Magnetic resistance indoor cycling bike', 12, 899.50,
 (select id from product.public.category where name = 'Cardio Machines')),
(nextval('product_seq'), 'Rowing Machine', 'Air resistance rowing machine', 10, 1099.00,
 (select id from product.public.category where name = 'Cardio Machines')),

-- Strength Machines
(nextval('product_seq'), 'Leg Press Machine', 'Heavy-duty leg press machine', 5, 2199.99,
 (select id from product.public.category where name = 'Strength Machines')),
(nextval('product_seq'), 'Lat Pulldown Machine', 'Back training machine with adjustable weights', 6, 1799.99,
 (select id from product.public.category where name = 'Strength Machines')),
(nextval('product_seq'), 'Chest Press Machine', 'Seated chest press machine', 7, 1899.99,
 (select id from product.public.category where name = 'Strength Machines')),

-- Accessories
(nextval('product_seq'), 'Resistance Bands Set', 'Set of 5 resistance bands with different tensions', 50, 39.99,
 (select id from product.public.category where name = 'Accessories')),
(nextval('product_seq'), 'Yoga Mat', 'Non-slip yoga and stretching mat', 60, 24.99,
 (select id from product.public.category where name = 'Accessories')),
(nextval('product_seq'), 'Lifting Gloves', 'Grip-enhancing workout gloves', 40, 19.99,
 (select id from product.public.category where name = 'Accessories')),

-- Functional Training
(nextval('product_seq'), 'Kettlebell 16kg', 'Cast iron kettlebell for functional training', 20, 69.99,
 (select id from product.public.category where name = 'Functional Training')),
(nextval('product_seq'), 'Battle Rope', '15m heavy battle rope', 10, 129.99,
 (select id from product.public.category where name = 'Functional Training')),
(nextval('product_seq'), 'Plyometric Box', 'Wooden plyo box for explosive training', 14, 159.99,
 (select id from product.public.category where name = 'Functional Training'));

