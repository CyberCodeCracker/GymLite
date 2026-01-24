package org.amouri.ecommerce.services;

import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.amouri.ecommerce.DTOs.ProductPurchasedRequest;
import org.amouri.ecommerce.DTOs.ProductPurchasedResponse;
import org.amouri.ecommerce.DTOs.ProductRequest;
import org.amouri.ecommerce.DTOs.ProductResponse;
import org.amouri.ecommerce.entities.ProductImage;
import org.amouri.ecommerce.exception.ProductPurchaseException;
import org.amouri.ecommerce.mappers.ProductMapper;
import org.amouri.ecommerce.repositories.ProductRepository;
import org.amouri.ecommerce.utils.FileService;
import org.jspecify.annotations.Nullable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.Comparator;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository repository;
    private final ProductMapper mapper;
    private final FileService fileService;

    @Transactional
    public Integer createProduct(@Valid ProductRequest request, List<MultipartFile> files) {
        var product = mapper.toProduct(request);
        product = repository.save(product);
        repository.flush();

        if (files != null && !files.isEmpty()) {
            for (int i = 0; i < files.size(); i++) {
                MultipartFile file = files.get(i);
                if (!file.isEmpty()) {
                    String imagePath = fileService.saveFile(file, product.getId());

                    ProductImage productImage = ProductImage.builder()
                            .imageUrl(imagePath)
                            .displayOrder(i)
                            .build();

                    product.addImage(productImage);
                }
            }
        }

        return product.getId();
    }

    public Set<ProductPurchasedResponse> purchaseProducts(@Valid Set<ProductPurchasedRequest> request) {
        var productsIds = request.stream()
                .map(ProductPurchasedRequest::id)
                .toList()
                ;
        var storedProducts = repository.findAllByIdInOrderById(productsIds);
        if (productsIds.size() != storedProducts.size()) {
            throw new ProductPurchaseException("One or more product do not exist");
        }

        var storedRequest = request.stream()
                .sorted(Comparator.comparing(ProductPurchasedRequest::id))
                .toList()
                ;
        var purchasedProducts = new HashSet<ProductPurchasedResponse>();
        for (int i = 0; i < storedProducts.size(); i++) {
            var product = storedProducts.get(i);
            var productRequest = storedRequest.get(i);
            if (product.getAvailableQuantity() < productRequest.availableQuantity()) {
                throw new ProductPurchaseException("Available quantity is less than desired quantity for product with ID:: " + product.getId());
            }
            var newAvailableQuantity = productRequest.availableQuantity() - product.getAvailableQuantity();
            product.setAvailableQuantity(newAvailableQuantity);
            repository.save(product);
            purchasedProducts.add(mapper.toProductPurchasedResponse(product));
        }
        return purchasedProducts;
    }

    public @Nullable ProductResponse findById(Integer productId) {
        return repository.findById(productId)
                .map(mapper::toProductResponse)
                .orElseThrow(
                        () -> new EntityNotFoundException("Product not found with ID:: " + productId)
                )
                ;
    }

    public List<ProductResponse> findAll() {
        return repository.findAll()
                .stream()
                .map(mapper::toProductResponse)
                .collect(Collectors.toList())
                ;
    }

}
