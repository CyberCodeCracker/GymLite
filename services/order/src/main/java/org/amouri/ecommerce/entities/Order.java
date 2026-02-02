package org.amouri.ecommerce.entities;

import jakarta.persistence.*;
import lombok.*;
import org.amouri.ecommerce.enums.PaymentMethod;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.math.BigDecimal;
import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
@Entity
@EntityListeners(AuditingEntityListener.class)
@Table(name = "customer_order")
public class Order {

    @Id
    @GeneratedValue
    private Integer id;

    private String reference;

    private BigDecimal totalAmount;

    @Enumerated(EnumType.STRING)
    private PaymentMethod paymentMethod;

    private Integer customerId;

    @OneToMany(mappedBy = "order")
    private List<OrderLine> orderLines;


}
