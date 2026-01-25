package org.amouri.ecommerce.services;

import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.amouri.ecommerce.DTOs.*;
import org.amouri.ecommerce.entities.Category;
import org.amouri.ecommerce.entities.Product;
import org.amouri.ecommerce.entities.ProductImage;
import org.amouri.ecommerce.exception.ProductPurchaseException;
import org.amouri.ecommerce.mappers.ProductMapper;
import org.amouri.ecommerce.repositories.CategoryRepository;
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

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final ProductMapper mapper;
    private final FileService fileService;

    @Transactional
    public Integer createProduct(@Valid ProductRequest request, List<MultipartFile> files) {
        var product = mapper.toProduct(request);
        product = productRepository.save(product);
        productRepository.flush();

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
        var storedProducts = productRepository.findAllByIdInOrderById(productsIds);
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
            productRepository.save(product);
            purchasedProducts.add(mapper.toProductPurchasedResponse(product));
        }
        return purchasedProducts;
    }

    public @Nullable ProductResponse findById(Integer productId) {
        return productRepository.findById(productId)
                .map(mapper::toProductResponse)
                .orElseThrow(
                        () -> new EntityNotFoundException("Product not found with ID:: " + productId)
                )
                ;
    }

    public List<ProductResponse> findAll() {
        return productRepository.findAll()
                .stream()
                .map(mapper::toProductResponse)
                .collect(Collectors.toList())
                ;
    }

    @Transactional
    public void addProductImages(Integer productId, List<MultipartFile> files) {
        var product = findProductById(productId);

        int startingOrder = product.getImages().size();

        for (int i = 0; i < files.size(); i++) {
            MultipartFile file = files.get(i);
            if (!file.isEmpty()) {
                String imagePath = fileService.saveFile(file, product.getId());

                if (imagePath != null) {
                    ProductImage productImage = ProductImage.builder()
                            .imageUrl(imagePath)
                            .displayOrder(startingOrder + i)
                            .build()
                            ;

                    product.addImage(productImage);
                }
            }
        }
    }

    @Transactional
    public void reorderProductImages(Integer productId, List<Integer> imageIds) {
        var product = findProductById(productId);

        Set<Integer> productImageIds = product.getImages().stream()
                .map(ProductImage::getId)
                .collect(Collectors.toSet());

        if (!productImageIds.containsAll(imageIds)) {
            throw new IllegalArgumentException("Some image IDs do not belong to this product");
        }


        for (int i = 0; i < imageIds.size(); i++) {
            Integer imageId = imageIds.get(i);
            int finalI = i;
            product.getImages().stream()
                    .filter(img -> img.getId().equals(imageId))
                    .findFirst()
                    .ifPresent(img -> img.setDisplayOrder(finalI));
        }
    }

    @Transactional
    public void deleteProduct(Integer productId) {
        var product = findProductById(productId);

        if (product.getImages() != null && !product.getImages().isEmpty()) {
            for (ProductImage image : product.getImages()) {
                fileService.deleteFile(image.getImageUrl());
            }
        }

        productRepository.deleteById(productId);
    }

    @Transactional
    public void deleteProductImage(Integer productId, Integer imageId) {
        var product = findProductById(productId);

        ProductImage imageToDelete = product.getImages().stream()
                .filter(img -> img.getId().equals(imageId))
                .findFirst()
                .orElseThrow(
                        () -> new EntityNotFoundException("Product image not found with ID:: " + imageId)
                );

        fileService.deleteFile(imageToDelete.getImageUrl());
        product.removeImage(imageToDelete);

        reorderImages(product);
    }

    @Transactional
    public ProductResponse updateProduct(Integer productId, @Valid UpdateProductRequest request) {
        var product = findProductById(productId);

        mapper.updateProductFromRequest(request, product);

        if (request.categoryId() != null) {
            Category category = categoryRepository.findById(request.categoryId())
                    .orElseThrow(() -> new EntityNotFoundException(
                            "Category not found with ID: " + request.categoryId()
                    ));
            product.setCategory(category);
        }

        return mapper.toProductResponse(product);
    }

    private void reorderImages(Product product) {
        List<ProductImage> images = product.getImages();
        for (int i = 0; i < images.size(); i++) {
            images.get(i).setDisplayOrder(i);
        }
    }

    public Product findProductById(Integer productId) {
        return productRepository.findById(productId)
                .orElseThrow(
                        () -> new EntityNotFoundException("Product not found with ID:: " + productId)
                );
    }

}
