package org.amouri.ecommerce.repositories;

import org.amouri.ecommerce.entities.Notification;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface NotificationRepository extends MongoRepository<Notification, String> {
}
