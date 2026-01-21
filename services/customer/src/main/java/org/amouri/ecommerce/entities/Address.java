package org.amouri.ecommerce.entities;

import lombok.*;
import org.springframework.validation.annotation.Validated;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
@Validated
public class Address {

    private String street;
    private String city;
    private String houseNumber;
    private String zipCode;
}
