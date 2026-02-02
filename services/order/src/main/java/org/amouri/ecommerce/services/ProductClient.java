package org.amouri.ecommerce.services;

import jakarta.ws.rs.core.MediaType;
import lombok.RequiredArgsConstructor;
import org.amouri.ecommerce.DTOs.PurchaseRequest;
import org.amouri.ecommerce.DTOs.PurchaseResponse;
import org.amouri.ecommerce.exception.BusinessException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductClient {

    @Value("${application.config.product.url}")
    private String productUrl;

    private final RestTemplate restTemplate;

    public List<PurchaseResponse> purchaseProducts(List<PurchaseRequest> requestBody) {

        HttpHeaders headers = new HttpHeaders();
        headers.set(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON);

        HttpEntity<List<PurchaseRequest>> requestEntity = new HttpEntity<>(requestBody, headers);
        ParameterizedTypeReference<List<PurchaseResponse>> responseType =
                new ParameterizedTypeReference<>() {};

        ResponseEntity<List<PurchaseResponse>> responseEntity = restTemplate.exchange(
                productUrl + "/purchase",
                HttpMethod.POST,
                requestEntity,
                responseType
        );

        if (responseEntity.getStatusCode().isError()) {
            throw new BusinessException("An error occurred while processing the products purchased"
                    + responseEntity.getStatusCode()
            );
        }
        return responseEntity.getBody();
    }
}
