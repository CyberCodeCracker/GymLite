package org.amouri.ecommerce.config;

import feign.Logger;
import feign.RequestInterceptor;
import feign.codec.Decoder;
import feign.codec.Encoder;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.boot.http.converter.autoconfigure.HttpMessageConverters;
import org.springframework.cloud.openfeign.support.FeignHttpMessageConverters;
import org.springframework.cloud.openfeign.support.SpringDecoder;
import org.springframework.cloud.openfeign.support.SpringEncoder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.util.List;

@Configuration
public class FeignConfig {

    @Bean
    public FeignHttpMessageConverters feignHttpMessageConverters(
            ObjectProvider<HttpMessageConverter<?>> messageConverters,
            ObjectProvider<org.springframework.cloud.openfeign.support.HttpMessageConverterCustomizer> customizers) {
        return new FeignHttpMessageConverters(messageConverters, customizers);
    }


    @Bean
    public Encoder feignEncoder(ObjectProvider<FeignHttpMessageConverters> messageConverters) {
        return new SpringEncoder(messageConverters);
    }

    @Bean
    public Decoder feignDecoder(ObjectProvider<FeignHttpMessageConverters> messageConverters) {
        return new SpringDecoder(messageConverters);
    }

    @Bean
    public Logger.Level feignLoggerLevel() {
        return Logger.Level.FULL;
    }

    @Bean
    public RequestInterceptor authForwardInterceptor() {
        return requestTemplate -> {
            ServletRequestAttributes attrs =
                    (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
            if (attrs != null) {
                HttpServletRequest request = attrs.getRequest();
                String auth = request.getHeader("Authorization");
                if (auth != null) {
                    requestTemplate.header("Authorization", auth);
                }
            }
        };
    }
}