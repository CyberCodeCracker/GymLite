package org.amouri.ecommerce.repositories;

import org.amouri.ecommerce.entities.Order;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderRepository extends JpaRepository<Order, Integer> {
}
