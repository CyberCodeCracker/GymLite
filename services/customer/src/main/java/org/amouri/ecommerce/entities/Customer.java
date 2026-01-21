package org.amouri.ecommerce.entities;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
@Document
public class Customer {

    @Id
    private Integer id;
    private String firstName;
    private String lastName;
    private String email;
    private Address address;
}
