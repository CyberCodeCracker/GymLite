package org.amouri.ecommerce.repositories;

import org.amouri.ecommerce.entities.Customer;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface CustomerRepository extends MongoRepository<Customer, String> {

    boolean existsByEmail(String email);
}
