package org.amouri.ecommerce.mappers;

import org.amouri.ecommerce.DTOs.CategoryRequest;
import org.amouri.ecommerce.DTOs.CategoryResponse;
import org.amouri.ecommerce.DTOs.UpdateCategoryRequest;
import org.amouri.ecommerce.DTOs.UpdateProductRequest;
import org.amouri.ecommerce.entities.Category;
import org.amouri.ecommerce.entities.Product;
import org.mapstruct.*;

@Mapper(componentModel = "spring", uses = ProductMapper.class)
public interface CategoryMapper {

    Category toCategory(CategoryRequest request);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateCategoryFromRequest(UpdateCategoryRequest request, @MappingTarget Category category);

    @Mapping(target = "products", source = "products")
    CategoryResponse toCategoryResponse(Category category);

}
