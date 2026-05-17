from django.contrib import admin
from django import forms
import json
from .models import Service

class ServiceAdminForm(forms.ModelForm):
    features = forms.CharField(
        widget=forms.Textarea(attrs={'rows': 3}), 
        required=False,
        help_text="Enter features as JSON list ['feat1', 'feat2'] or one per line."
    )
    specifications = forms.CharField(
        widget=forms.Textarea(attrs={'rows': 3}), 
        required=False,
        help_text='Enter as JSON {"key": "value"} or "Key: Value" per line.'
    )

    class Meta:
        model = Service
        fields = '__all__'

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        if self.instance and self.instance.pk:
            if isinstance(self.instance.features, list):
                self.initial['features'] = '\n'.join(self.instance.features) if self.instance.features else ''
            elif isinstance(self.instance.features, str):
                self.initial['features'] = self.instance.features
            else:
                self.initial['features'] = json.dumps(self.instance.features) if self.instance.features else ''
            
            if hasattr(self.instance, 'specifications'):
                if isinstance(self.instance.specifications, dict):
                    lines = [f"{k}: {v}" for k, v in self.instance.specifications.items()]
                    self.initial['specifications'] = '\n'.join(lines) if lines else ''
                elif isinstance(self.instance.specifications, str):
                    self.initial['specifications'] = self.instance.specifications
                else:
                    self.initial['specifications'] = json.dumps(self.instance.specifications) if self.instance.specifications else ''

    def clean_features(self):
        data = self.cleaned_data.get('features', '')
        if isinstance(data, str):
            data = data.strip()
            if not data:
                return []
            try:
                parsed = json.loads(data)
                if isinstance(parsed, list):
                    return parsed
            except json.JSONDecodeError:
                pass
            return [item.strip() for item in data.split('\n') if item.strip()]
        return data or []

    def clean_specifications(self):
        data = self.cleaned_data.get('specifications', '')
        if isinstance(data, str):
            data = data.strip()
            if not data:
                return {}
            try:
                parsed = json.loads(data)
                if isinstance(parsed, dict):
                    return parsed
            except json.JSONDecodeError:
                pass
            specs = {}
            for line in data.split('\n'):
                if ':' in line:
                    k, v = line.split(':', 1)
                    specs[k.strip()] = v.strip()
            return specs
        return data or {}

@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    form = ServiceAdminForm
    list_display = ('name', 'service_type', 'base_price', 'duration_hours', 'is_active', 'created_at')
    list_filter = ('service_type', 'is_active')
    search_fields = ('name', 'description')
    ordering = ('-created_at',)
    readonly_fields = ('created_at', 'updated_at')
    actions = ['activate_services', 'deactivate_services']

    def activate_services(self, request, queryset):
        queryset.update(is_active=True)
    activate_services.short_description = "Mark selected services as Active"

    def deactivate_services(self, request, queryset):
        queryset.update(is_active=False)
    deactivate_services.short_description = "Mark selected services as Inactive"

