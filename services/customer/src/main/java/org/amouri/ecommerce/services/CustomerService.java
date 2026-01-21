package org.amouri.ecommerce.services;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.amouri.ecommerce.DTOs.CustomerRequest;
import org.amouri.ecommerce.DTOs.CustomerResponse;
import org.amouri.ecommerce.entities.Customer;
import org.amouri.ecommerce.exceptions.CustomerNotFoundException;
import org.amouri.ecommerce.mappers.CustomerMapper;
import org.amouri.ecommerce.repositories.CustomerRepository;
import org.jspecify.annotations.Nullable;
import org.springframework.stereotype.Service;


import java.util.List;
import java.util.stream.Collectors;

import static java.lang.String.format;

@Service
@RequiredArgsConstructor
public class CustomerService {

    private final CustomerRepository repository;
    private final CustomerMapper mapper;

    public Integer createCustomer(@Valid CustomerRequest request) {
        var customer = repository.save(mapper.toCustomer(request));
        return customer.getId();
    }

    public void updateCustomer(@Valid CustomerRequest request, int id) {
        var customer = repository.findById(request.id()).orElseThrow(
                () -> new CustomerNotFoundException(format("Cannot update customer:: No customer found with the provided ID:: %d", request.id()))
        );
        mapper.updateCustomerFromRequest(request, customer);
        repository.save(customer);
    }

    public List<CustomerResponse> getAllCustomers() {
        return repository.findAll()
                .stream()
                .map(mapper::toCustomerResponse)
                .collect(Collectors.toList())
                ;
    }

    public Boolean existsById(Integer id) {
        return repository.findById(id)
                .isPresent();
    }

    public CustomerResponse findById(Integer id) {
        return repository.findById(id)
                .map(mapper::toCustomerResponse)
                .orElseThrow(
                        () -> new CustomerNotFoundException(format("Cannot retrieve customer:: No customer found with the provided ID:: %d", id))
                )
                ;
    }

    public void deleteById(Integer id) {
        repository.deleteById(id);
    }
}
