from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import Receipt, ReceiptItem, Budget, db
from datetime import datetime, timedelta
from sqlalchemy import func
import json

analytics_bp = Blueprint('analytics', __name__)

@analytics_bp.route('/spending-trends', methods=['GET'])
@jwt_required()
def spending_trends():
    try:
        user_id = get_jwt_identity()
        
        # Get spending for the last 12 months
        end_date = datetime.now()
        start_date = end_date - timedelta(days=365)
        
        receipts = Receipt.query.filter(
            Receipt.user_id == user_id,
            Receipt.purchase_date >= start_date,
            Receipt.purchase_date <= end_date
        ).all()
        
        # Group by month
        monthly_spending = {}
        for receipt in receipts:
            month_key = receipt.purchase_date.strftime('%Y-%m')
            if month_key not in monthly_spending:
                monthly_spending[month_key] = 0
            monthly_spending[month_key] += receipt.total_amount
        
        return jsonify({
            'monthly_spending': monthly_spending,
            'total_spending': sum(receipt.total_amount for receipt in receipts),
            'average_monthly': sum(monthly_spending.values()) / max(len(monthly_spending), 1)
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@analytics_bp.route('/category-breakdown', methods=['GET'])
@jwt_required()
def category_breakdown():
    try:
        user_id = get_jwt_identity()
        
        # Get category spending
        category_query = db.session.query(
            ReceiptItem.category,
            func.sum(ReceiptItem.total_price).label('total_spent'),
            func.count(ReceiptItem.id).label('item_count')
        ).join(Receipt).filter(
            Receipt.user_id == user_id
        ).group_by(ReceiptItem.category).all()
        
        categories = []
        for category, total_spent, item_count in category_query:
            categories.append({
                'category': category or 'Other',
                'total_spent': float(total_spent),
                'item_count': item_count
            })
        
        return jsonify({'categories': categories}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@analytics_bp.route('/top-products', methods=['GET'])
@jwt_required()
def top_products():
    try:
        user_id = get_jwt_identity()
        limit = request.args.get('limit', 10, type=int)
        
        product_query = db.session.query(
            ReceiptItem.product_name,
            func.sum(ReceiptItem.total_price).label('total_spent'),
            func.sum(ReceiptItem.quantity).label('total_quantity'),
            func.count(ReceiptItem.id).label('purchase_frequency')
        ).join(Receipt).filter(
            Receipt.user_id == user_id
        ).group_by(ReceiptItem.product_name).order_by(
            func.sum(ReceiptItem.total_price).desc()
        ).limit(limit).all()
        
        products = []
        for product_name, total_spent, total_quantity, frequency in product_query:
            products.append({
                'product_name': product_name,
                'total_spent': float(total_spent),
                'total_quantity': int(total_quantity),
                'purchase_frequency': frequency,
                'average_price': float(total_spent) / max(int(total_quantity), 1)
            })
        
        return jsonify({'top_products': products}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@analytics_bp.route('/shopping-patterns', methods=['GET'])
@jwt_required()
def shopping_patterns():
    try:
        user_id = get_jwt_identity()
        
        receipts = Receipt.query.filter_by(user_id=user_id).all()
        
        # Analyze shopping patterns
        day_of_week = {}
        hour_of_day = {}
        store_frequency = {}
        
        for receipt in receipts:
            # Day of week (0=Monday, 6=Sunday)
            day = receipt.purchase_date.strftime('%A')
            day_of_week[day] = day_of_week.get(day, 0) + 1
            
            # Hour of day
            hour = receipt.purchase_date.hour
            hour_of_day[hour] = hour_of_day.get(hour, 0) + 1
            
            # Store frequency
            store_frequency[receipt.store_name] = store_frequency.get(receipt.store_name, 0) + 1
        
        return jsonify({
            'day_of_week_patterns': day_of_week,
            'hour_of_day_patterns': hour_of_day,
            'favorite_stores': dict(sorted(store_frequency.items(), key=lambda x: x[1], reverse=True)[:5])
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@analytics_bp.route('/budget-analysis', methods=['GET'])
@jwt_required()
def budget_analysis():
    try:
        user_id = get_jwt_identity()
        
        budgets = Budget.query.filter_by(user_id=user_id).all()
        
        analysis = []
        for budget in budgets:
            utilization = (budget.spent_amount / budget.total_budget * 100) if budget.total_budget > 0 else 0
            remaining_days = (budget.end_date - datetime.now()).days
            
            status = 'on_track'
            if utilization > 90:
                status = 'over_budget'
            elif utilization > 75:
                status = 'warning'
            
            analysis.append({
                'budget': budget.to_dict(),
                'utilization_percentage': utilization,
                'remaining_days': max(remaining_days, 0),
                'status': status,
                'daily_budget_remaining': budget.total_budget - budget.spent_amount / max(remaining_days, 1) if remaining_days > 0 else 0
            })
        
        return jsonify({'budget_analysis': analysis}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@analytics_bp.route('/sustainability-score', methods=['GET'])
@jwt_required()
def sustainability_score():
    try:
        user_id = get_jwt_identity()
        
        # Mock sustainability analysis - in production this would use real data
        receipts = Receipt.query.filter_by(user_id=user_id).all()
        
        total_items = sum(len(receipt.items) for receipt in receipts)
        organic_items = sum(1 for receipt in receipts for item in receipt.items if 'organic' in item.product_name.lower())
        local_items = sum(1 for receipt in receipts for item in receipt.items if any(keyword in item.product_name.lower() for keyword in ['local', 'farm']))
        
        sustainability_score = 0
        if total_items > 0:
            organic_percentage = organic_items / total_items * 100
            local_percentage = local_items / total_items * 100
            sustainability_score = min((organic_percentage + local_percentage) / 2, 100)
        
        recommendations = []
        if organic_percentage < 20:
            recommendations.append("Try buying more organic products to reduce environmental impact")
        if local_percentage < 15:
            recommendations.append("Consider purchasing more locally sourced items to support local farmers")
        
        return jsonify({
            'sustainability_score': round(sustainability_score, 1),
            'organic_percentage': round(organic_percentage, 1),
            'local_percentage': round(local_percentage, 1),
            'recommendations': recommendations
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
