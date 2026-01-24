package org.amouri.ecommerce.mappers;

import org.amouri.ecommerce.DTOs.ProductPurchasedRequest;
import org.amouri.ecommerce.DTOs.ProductPurchasedResponse;
import org.amouri.ecommerce.DTOs.ProductRequest;
import org.amouri.ecommerce.DTOs.ProductResponse;
import org.amouri.ecommerce.entities.Product;
import org.amouri.ecommerce.entities.ProductImage;
import org.mapstruct.*;

import java.util.List;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring")
public interface ProductMapper {

    Product toProduct(ProductRequest request);

    @Mapping(target = "categoryId", source = "category.id")
    @Mapping(target = "categoryName", source = "category.name")
    @Mapping(target = "categoryDescription", source = "category.description")
    @Mapping(target = "imageUrls", expression = "java(mapImageUrls(product))")
    ProductResponse toProductResponse(Product product);

    ProductPurchasedResponse toProductPurchasedResponse(Product product);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateProductFromRequest(ProductRequest request, @MappingTarget Product product);

    default List<String> mapImageUrls(Product product) {
        if (product.getImages() == null) {
            return List.of();
        }
        return product.getImages().stream()
                .map(ProductImage::getImageUrl)
                .collect(Collectors.toList());
    }
}