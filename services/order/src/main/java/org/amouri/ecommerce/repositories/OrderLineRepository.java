package org.amouri.ecommerce.repositories;

import org.amouri.ecommerce.DTOs.OrderLineResponse;
import org.amouri.ecommerce.entities.OrderLine;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface OrderLineRepository extends JpaRepository<OrderLine, Integer> {

    List<OrderLine> getByOrderId(Integer orderId);
}
