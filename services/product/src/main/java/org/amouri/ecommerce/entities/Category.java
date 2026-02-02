package org.amouri.ecommerce.entities;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.util.List;
import java.util.Set;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
@Entity
@EntityListeners(AuditingEntityListener.class)
public class Category {

    @Id
    @GeneratedValue
    private Integer id;

    private String name;

    private String description;

    @OneToMany(mappedBy = "category", cascade = CascadeType.REMOVE)
    private Set<Product> products;

    public void addProduct(Product product) {
        product.setCategory(this);
        products.add(product);
    }

    public void removeProduct(Product product) {
        product.setCategory(null);
        products.remove(product);
    }

}
