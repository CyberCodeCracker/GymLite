package org.amouri.ecommerce.config;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.ClientHttpRequestInterceptor;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.util.List;

@Configuration
public class RestTemplateConfig {

    @Bean
    public RestTemplate restTemplate() {
        RestTemplate restTemplate = new RestTemplate();
        restTemplate.setInterceptors(List.of(authInterceptor()));
        return restTemplate;
    }

    private ClientHttpRequestInterceptor authInterceptor() {
        return (request, body, execution) -> {
            ServletRequestAttributes attrs =
                    (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
            if (attrs != null) {
                HttpServletRequest servletRequest = attrs.getRequest();
                String auth = servletRequest.getHeader("Authorization");
                if (auth != null) {
                    request.getHeaders().set("Authorization", auth);
                }
            }
            return execution.execute(request, body);
        };
    }
}
