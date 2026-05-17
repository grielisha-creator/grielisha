from rest_framework import generics, permissions, filters, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.views import APIView
from django_filters.rest_framework import DjangoFilterBackend
from .models import Product, Category, Wishlist
from .serializers import ProductSerializer, ProductListSerializer, CategorySerializer, WishlistSerializer

class WishlistView(generics.RetrieveAPIView):
    """
    Retrieves the current user's wishlist, containing both products and services.
    Automatically creates a wishlist if one does not exist for the authenticated user.
    """
    serializer_class = WishlistSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_object(self):
        wishlist, created = Wishlist.objects.get_or_create(user=self.request.user)
        return wishlist

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def toggle_wishlist(request):
    wishlist, created = Wishlist.objects.get_or_create(user=request.user)
    product_id = request.data.get('product_id')
    service_id = request.data.get('service_id')
    
    if product_id:
        if wishlist.products.filter(id=product_id).exists():
            wishlist.products.remove(product_id)
            return Response({'status': 'removed', 'type': 'product'})
        else:
            wishlist.products.add(product_id)
            return Response({'status': 'added', 'type': 'product'})
    elif service_id:
        if wishlist.services.filter(id=service_id).exists():
            wishlist.services.remove(service_id)
            return Response({'status': 'removed', 'type': 'service'})
        else:
            wishlist.services.add(service_id)
            return Response({'status': 'added', 'type': 'service'})
            
    return Response({'error': 'No product_id or service_id provided'}, status=status.HTTP_400_BAD_REQUEST)

class IsAdminOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user and request.user.is_staff

class ProductListCreateView(generics.ListCreateAPIView):
    """
    List all products or create a new one.
    Staff members can view all products, while customers see only active items.
    """
    permission_classes = [IsAdminOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category', 'category_type']
    search_fields = ['name', 'description']
    ordering_fields = ['name', 'price', 'created_at']
    ordering = ['-created_at']

    def get_queryset(self):
        if self.request.user and self.request.user.is_authenticated and self.request.user.is_staff:
            return Product.objects.all()
        return Product.objects.filter(is_active=True)

    def get_serializer_class(self):
        if self.request.method == 'GET':
            return ProductListSerializer
        return ProductSerializer

class ProductDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ProductSerializer
    permission_classes = [IsAdminOrReadOnly]

    def get_queryset(self):
        if self.request.user and self.request.user.is_authenticated and self.request.user.is_staff:
            return Product.objects.all()
        return Product.objects.filter(is_active=True)

class CategoryListCreateView(generics.ListCreateAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAdminOrReadOnly]

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

class CategoryDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAdminOrReadOnly]

class ProductBulkActionView(APIView):
    permission_classes = [permissions.IsAdminUser]
    
    def post(self, request):
        ids = request.data.get('ids', [])
        action = request.data.get('action')
        
        if not ids or not action:
            return Response({'error': 'Missing ids or action'}, status=status.HTTP_400_BAD_REQUEST)
            
        products = Product.objects.filter(id__in=ids)
        
        if action == 'delete':
            products.delete()
            return Response({'message': f'Successfully deleted {len(ids)} products'})
        elif action == 'set_active':
            products.update(is_active=True)
            return Response({'message': f'Set {len(ids)} products to active'})
        elif action == 'set_inactive':
            products.update(is_active=False)
            return Response({'message': f'Set {len(ids)} products to inactive'})
        else:
            return Response({'error': 'Invalid action'}, status=status.HTTP_400_BAD_REQUEST)

from django.db.models import Count, Sum
from services.models import Service
from services.serializers import ServiceListSerializer
from orders.models import Order
from django.contrib.auth import get_user_model

User = get_user_model()

class RecommendationView(APIView):
    permission_classes = [permissions.AllowAny]
    
    def get(self, request):
        # ... logic stays same ...
        popular_products = Product.objects.filter(is_active=True).annotate(
            order_count=Count('orderitem')
        ).order_by('-order_count')[:4]
        
        featured_products = Product.objects.filter(is_active=True, is_featured=True)[:4]
        featured_services = Service.objects.filter(is_active=True, is_featured=True)[:4]
        
        cross_sell_services = []
        if request.user.is_authenticated:
            has_cleaning_items = Product.objects.filter(
                orderitem__order__user=request.user,
                category_type__in=['cleaning_detergents', 'cleaning_tools']
            ).exists()
            
            if has_cleaning_items:
                cross_sell_services = Service.objects.filter(
                    service_type__in=['house_cleaning', 'office_cleaning', 'compound_cleaning']
                )[:2]

        return Response({
            'popular_products': ProductListSerializer(popular_products, many=True, context={'request': request}).data,
            'featured_products': ProductListSerializer(featured_products, many=True, context={'request': request}).data,
            'featured_services': ServiceListSerializer(featured_services, many=True, context={'request': request}).data,
            'cross_sell_services': ServiceListSerializer(cross_sell_services, many=True, context={'request': request}).data if cross_sell_services else []
        })

class StatsSummaryView(APIView):
    """
    Provides a high-level summary of the ecosystem metrics for the Admin Dashboard.
    Includes product counts, volume, total orders, and total revenue.
    """
    permission_classes = [permissions.IsAdminUser]
    
    def get(self, request):
        data = {
            'productCount': Product.objects.filter(is_active=True).count(),
            'serviceCount': Service.objects.filter(is_active=True).count(),
            'totalOrders': Order.objects.count(),
            'totalUsers': User.objects.count(),
            'totalRevenue': Order.objects.filter(status='paid').aggregate(Sum('total_amount'))['total_amount__sum'] or 0,
        }
        return Response(data)
