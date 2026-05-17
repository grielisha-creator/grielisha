from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView
from django.http import JsonResponse
from rest_framework.decorators import api_view, permission_classes
from rest_framework import permissions
from rest_framework.response import Response
from core.views import force_provision

@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def api_info(request):
    return Response({
        'status': 'online',
        'message': 'GRIELISHA Ecosystem API - Synchronized',
        'environment': 'production' if not settings.DEBUG else 'development',
        'version': '1.1.0',
        'endpoints': {
            'auth': '/api/auth/',
            'products': '/api/products/',
            'services': '/api/services/',
            'orders': '/api/orders/',
            'bookings': '/api/bookings/',
            'docs': '/api/docs/',
            'schema': '/api/schema/',
            'admin': '/admin/'
        }
    })

urlpatterns = [
    path('', api_info, name='api_info'),
    path('api/debug/provision/', force_provision, name='force_provision'),
    path('api/', api_info, name='api_info_alt'),
    path('admin/', admin.site.urls),
    path('api/auth/', include('accounts.urls')),
    path('api/products/', include('products.urls')),
    path('api/services/', include('services.urls')),
    path('api/orders/', include('orders.urls')),
    path('api/bookings/', include('bookings.urls')),
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),

    # Fail-safe root aliases for misconfigured frontends
    path('auth/', include('accounts.urls')),
    path('products/', include('products.urls')),
    path('services/', include('services.urls')),
    path('orders/', include('orders.urls')),
    path('bookings/', include('bookings.urls')),
]

from django.urls import re_path
from django.views.static import serve

urlpatterns += [
    re_path(r'^media/(?P<path>.*)$', serve, {
        'document_root': settings.MEDIA_ROOT,
    }),
]

# Django Admin Customization
admin.site.site_header = "GRIELISHA Ecosystem Management"
admin.site.site_title = "GRIELISHA Admin"
admin.site.index_title = "Welcome to GRIELISHA Digital Back-Office"
