package org.amouri.ecommerce.repositories;

import org.amouri.ecommerce.entities.OrderLine;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderLineRepository extends JpaRepository<OrderLine, Integer> {

    List<OrderLine> getByOrderId(Integer orderId);
}
