package org.amouri.ecommerce.repositories;

import org.amouri.ecommerce.entities.ProductImage;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductImageRepository extends JpaRepository<ProductImage, Integer> {
}
