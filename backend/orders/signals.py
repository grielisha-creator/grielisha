from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Payment, Order
from accounts.models import ActivityLog

@receiver(post_save, sender=Payment)
def log_payment_activity(sender, instance, created, **kwargs):
    try:
        if created:
            target = f"Order #{instance.order.id}" if instance.order else f"Booking #{instance.booking.id}"
            ActivityLog.objects.create(
                user=instance.user,
                action='purchase',
                description=f"Payment initiated for {target}. Method: {instance.payment_method}. Amount: KES {instance.amount}"
            )
        elif instance.status == 'verified':
            target = f"Order #{instance.order.id}" if instance.order else f"Booking #{instance.booking.id}"
            ActivityLog.objects.create(
                user=instance.user,
                action='purchase',
                description=f"Payment VERIFIED for {target}. M-Pesa/Ref: {instance.transaction_code}"
            )
    except Exception as e:
        print(f"Logging error in log_payment_activity: {e}")

@receiver(post_save, sender=Order)
def log_order_status_change(sender, instance, created, **kwargs):
    try:
        if not created:
            ActivityLog.objects.create(
                user=instance.user,
                action='purchase',
                description=f"Order #{instance.id} status updated to: {instance.status}"
            )
    except Exception as e:
        print(f"Logging error in log_order_status_change: {e}")
