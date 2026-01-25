package org.amouri.ecommerce.services;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.amouri.ecommerce.DTOs.CategoryRequest;
import org.amouri.ecommerce.DTOs.CategoryResponse;
import org.amouri.ecommerce.DTOs.ProductRequest;
import org.amouri.ecommerce.DTOs.UpdateCategoryRequest;
import org.amouri.ecommerce.entities.Category;
import org.amouri.ecommerce.entities.Product;
import org.amouri.ecommerce.mappers.CategoryMapper;
import org.amouri.ecommerce.mappers.ProductMapper;
import org.amouri.ecommerce.repositories.CategoryRepository;
import org.jspecify.annotations.Nullable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final CategoryMapper categoryMapper;
    private final ProductMapper productMapper;
    private final ProductService productService;

    public @Nullable Integer createCategory(CategoryRequest request) {
        var category = categoryMapper.toCategory(request);

        categoryRepository.save(category);

        return category.getId();
    }

    @Transactional
    public CategoryResponse updateCategory(UpdateCategoryRequest request, Integer categoryId) {
        var category = findCategoryById(categoryId);

        categoryMapper.updateCategoryFromRequest(request, category);
        categoryRepository.save(category);

        return categoryMapper.toCategoryResponse(category);
    }

    @Transactional
    public void addProduct(ProductRequest request, Integer categoryId) {
        var category = findCategoryById(categoryId);
        var product = productMapper.toProduct(request);

        category.addProduct(product);

        categoryRepository.save(category);
    }

    public List<CategoryResponse> getAllCategories() {
        return categoryRepository.findAll().stream()
                .map(categoryMapper::toCategoryResponse)
                .collect(Collectors.toList())
                ;
    }

    public CategoryResponse getCategoryById(Integer categoryId) {
        var category = findCategoryById(categoryId);

        return categoryMapper.toCategoryResponse(category);
    }

    @Transactional
    public void deleteCategoryById(Integer categoryId) {
        var category = findCategoryById(categoryId);

        List<Integer> productIds = category.getProducts().stream()
                .map(Product::getId)
                .toList()
                ;

        for (Integer productId : productIds) {
            productService.deleteProduct(productId);
        }

        categoryRepository.deleteById(categoryId);
    }

    @Transactional
    public void deleteProductFromCategory(Integer categoryId, Integer productId) {
        var category = findCategoryById(categoryId);
        var product = productService.findProductById(productId);

        if (!product.getCategory().getId().equals(categoryId)) {
            throw new IllegalArgumentException(
                    "Product with ID:: " + productId + " does not belong to category with ID:: " + categoryId
            );
        }

        category.getProducts().remove(product);

        categoryRepository.save(category);
    }

    @Transactional
    public void deleteProductsFromCategory(Integer categoryId, List<Integer> productIds) {
        var category = findCategoryById(categoryId);

        for (Integer productId : productIds) {
            var product = productService.findProductById(productId);
            if (!product.getCategory().getId().equals(categoryId)) {
                throw new IllegalArgumentException("Product with ID:: " + productId + " does not belong to category with ID:: " + categoryId);
            }
            category.getProducts().remove(product);
        }

        categoryRepository.save(category);
    }

    public Category findCategoryById(Integer categoryId) {
        return categoryRepository.findById(categoryId).orElseThrow(
                () -> new EntityNotFoundException("Category not found with ID:: " + categoryId)
        );
    }

}
