package org.amouri.ecommerce.services;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.amouri.ecommerce.DTOs.ProductPurchasedRequest;
import org.amouri.ecommerce.DTOs.ProductPurchasedResponse;
import org.amouri.ecommerce.DTOs.ProductRequest;
import org.amouri.ecommerce.DTOs.ProductResponse;
import org.jspecify.annotations.Nullable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class ProductService {



    public @Nullable Integer createProduct(@Valid ProductRequest request) {
    }

    public @Nullable Set<ProductPurchasedResponse> purchaseProducts(@Valid Set<ProductPurchasedRequest> request) {
    }

    public @Nullable ProductResponse findById(Integer productId) {
    }

    public @Nullable List<ProductResponse> findAll() {
    }
}
