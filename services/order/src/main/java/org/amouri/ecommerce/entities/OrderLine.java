package org.amouri.ecommerce.entities;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.math.BigDecimal;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
@Entity
@EntityListeners(AuditingEntityListener.class)
public class OrderLine {

    @Id
    @GeneratedValue
    public Integer id;

    @ManyToOne
    @JoinColumn(name = "order_id")
    private Order order;

    private Integer productId;

    private double quantity;

    private BigDecimal unitPrice;
}
