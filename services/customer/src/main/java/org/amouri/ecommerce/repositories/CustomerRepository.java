package org.amouri.ecommerce.repositories;

import org.amouri.ecommerce.entities.Customer;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface CustomerRepository extends MongoRepository<Customer, Integer> {
}
