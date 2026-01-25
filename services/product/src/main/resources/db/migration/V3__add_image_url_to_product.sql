-- Category table
create table if not exists category
(
    id integer not null primary key,
    description varchar(255),
    name varchar(255)
);

-- Product table (removed image_url, added images relationship)
create table if not exists product
(
    id integer not null primary key,
    description varchar(255),
    name varchar(255),
    available_quantity double precision not null,
    price numeric(38, 2),
    category_id integer
        constraint fk_category references category
);

-- New ProductImage table
create table if not exists product_image
(
    id integer not null primary key,
    image_url varchar(500) not null,
    display_order integer,
    product_id integer not null
        constraint fk_product references product on delete cascade
);

-- Sequences
create sequence if not exists category_seq increment by 50;
create sequence if not exists product_seq increment by 50;
create sequence if not exists product_image_seq increment by 50;

-- Indexes for better performance
create index if not exists idx_product_category_id on product(category_id);
create index if not exists idx_product_image_product_id on product_image(product_id);
create index if not exists idx_product_image_display_order on product_image(display_order);