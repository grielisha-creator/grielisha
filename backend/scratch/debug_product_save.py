import os
import sys
import django
project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(project_root)

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'grielisha.settings')
django.setup()

from products.models import Product, Category

def test_save():
    try:
        cat = Category.objects.first()
        if not cat:
            print("Creating temporary category...")
            cat = Category.objects.create(name="Test Category")
        
        p = Product.objects.first()
        if not p:
            print("Creating temporary product...")
            p = Product(
                name="Debug Product",
                description="Debug Description",
                price=10.00,
                category=cat,
                category_type="stationery"
            )
        else:
            print(f"Updating product: {p.name}")
            p.name = p.name + " (updated)"
            
        p.save()
        print("Save successful!")
    except Exception:
        traceback.print_exc()

if __name__ == "__main__":
    test_save()
