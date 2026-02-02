package org.amouri.ecommerce.repositories;

import org.amouri.ecommerce.entities.OrderLine;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderLineRepository extends JpaRepository<OrderLine, Integer> {
}
