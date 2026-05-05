from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from .models import Product
from accounts.models import ActivityLog

@receiver(post_save, sender=Product)
def log_product_changes(sender, instance, created, **kwargs):
    action = 'admin_action'
    verb = "created" if created else "updated"
    status = "Active" if instance.is_active else "Inactive"
    
    # We log this centrally. Note: Signal doesn't have request/admin user context.
    # In a full system, we might use a thread-local to capture the current user,
    # but for this MVP architecture, we log the system event.
    
    # We find the first admin to associate the log if the user context is missing
    from django.contrib.auth import get_user_model
    User = get_user_model()
    admin = User.objects.filter(is_staff=True).first()
    
    if admin:
        try:
            ActivityLog.objects.create(
                user=admin,
                action=action,
                description=f"Product '{instance.name}' was {verb}. Status: {status}. Stock: {instance.stock_quantity}"
            )
        except Exception as e:
            print(f"Logging error in log_product_changes: {e}")

