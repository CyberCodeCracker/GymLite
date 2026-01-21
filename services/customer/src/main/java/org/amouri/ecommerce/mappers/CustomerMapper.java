package org.amouri.ecommerce.mappers;

import org.amouri.ecommerce.DTOs.CustomerRequest;
import org.amouri.ecommerce.DTOs.CustomerResponse;
import org.amouri.ecommerce.entities.Customer;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring")
public interface CustomerMapper {

    Customer toCustomer(CustomerRequest customerRequest);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateCustomerFromRequest(CustomerRequest request, @MappingTarget Customer customer);

    CustomerResponse toCustomerResponse(Customer customer);
}
