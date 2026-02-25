package org.amouri.ecommerce.entities;

import lombok.*;
import org.amouri.ecommerce.custom_annotations.unique_email.UniqueEmail;
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
    private String id;
    private String firstName;
    private String lastName;
    @UniqueEmail
    private String email;
    private Address address;
}
