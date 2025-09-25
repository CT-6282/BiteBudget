from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import Product, db
import json

products_bp = Blueprint('products', __name__)

@products_bp.route('/', methods=['GET'])
def get_products():
    try:
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 20, type=int)
        category = request.args.get('category')
        search = request.args.get('search')
        
        query = Product.query
        
        if category:
            query = query.filter(Product.category == category)
        
        if search:
            query = query.filter(Product.name.contains(search))
        
        products = query.paginate(
            page=page, per_page=per_page, error_out=False
        )
        
        return jsonify({
            'products': [product.to_dict() for product in products.items],
            'total': products.total,
            'pages': products.pages,
            'current_page': page
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@products_bp.route('/categories', methods=['GET'])
def get_categories():
    try:
        categories = db.session.query(Product.category).distinct().all()
        category_list = [category[0] for category in categories if category[0]]
        
        return jsonify({'categories': category_list}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@products_bp.route('/price-comparison', methods=['POST'])
def price_comparison():
    try:
        data = request.get_json()
        product_names = data.get('products', [])
        
        # Mock price comparison - in production this would call real APIs
        comparison_data = []
        
        mock_stores = [
            {'name': 'SuperMart', 'type': 'supermarket'},
            {'name': 'Fresh Market', 'type': 'organic'},
            {'name': 'Budget Store', 'type': 'discount'},
            {'name': 'Corner Shop', 'type': 'convenience'}
        ]
        
        for product_name in product_names:
            product_data = {
                'product_name': product_name,
                'stores': []
            }
            
            for store in mock_stores:
                # Generate mock prices
                base_price = hash(product_name + store['name']) % 20 + 5
                if store['type'] == 'organic':
                    base_price *= 1.3
                elif store['type'] == 'discount':
                    base_price *= 0.8
                elif store['type'] == 'convenience':
                    base_price *= 1.2
                
                product_data['stores'].append({
                    'store_name': store['name'],
                    'price': round(base_price, 2),
                    'availability': True,
                    'store_type': store['type']
                })
            
            comparison_data.append(product_data)
        
        return jsonify({'comparison': comparison_data}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@products_bp.route('/recommendations', methods=['GET'])
@jwt_required()
def get_recommendations():
    try:
        user_id = get_jwt_identity()
        
        # Mock product recommendations based on purchase history
        recommendations = [
            {
                'product_name': 'Organic Almond Milk',
                'category': 'Dairy Alternatives',
                'reason': 'Based on your purchase of organic products',
                'average_price': 4.99,
                'sustainability_score': 85
            },
            {
                'product_name': 'Free-Range Eggs',
                'category': 'Eggs',
                'reason': 'Frequently bought together with organic milk',
                'average_price': 6.50,
                'sustainability_score': 78
            },
            {
                'product_name': 'Quinoa',
                'category': 'Grains',
                'reason': 'Popular among health-conscious shoppers',
                'average_price': 8.99,
                'sustainability_score': 92
            },
            {
                'product_name': 'Local Honey',
                'category': 'Sweeteners',
                'reason': 'Supports local farmers and has high sustainability score',
                'average_price': 12.99,
                'sustainability_score': 95
            }
        ]
        
        return jsonify({'recommendations': recommendations}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
